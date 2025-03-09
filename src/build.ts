import path from "path";
import { readFile, readdir, writeFile, stat } from "fs/promises";
import { ensureDir } from "fs-extra";
import { Database } from "bun:sqlite";
import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";
import { parseMarkdown } from "./parseMarkdown.js";

const db = new Database("db/content.sqlite", { create: true });
export interface Asset {
  asset_id: string;
  thumbhash: string;
  file_hash: string;
  last_modified: number;
}
export interface Post {
  post_id?: number;
  name: string;
  title: string;
  created: string;
  banner_image: string | null;
  banner_alt: string | null;
  content_hash: string;
  last_modified: number;
}

// Inputs
const markdownDir = path.join(__dirname, "markdown");
const assetsDir = path.join(markdownDir, "_assets");
// Outputs
const postsDir = path.join(__dirname, "content", "posts");
const imagesDir = path.join("public", "images");
const videosDir = path.join("public", "videos");

async function processImage(fileName: string) {
  const filePath = path.join(assetsDir, fileName);
  const imageName = encodeURI(path.parse(filePath).name);
  const fileHash = await calculateFileHash(filePath);
  const lastModified = await getFileModificationTime(filePath);

  const existingAsset = db
    .query("SELECT file_hash, last_modified FROM assets WHERE asset_id = ?")
    .get(imageName) as Asset | undefined;

  if (
    existingAsset &&
    existingAsset.file_hash === fileHash &&
    existingAsset.last_modified === lastModified
  ) {
    return; // Skip if unchanged
  }

  const img = sharp(filePath);
  const { width, height } = await img.metadata();

  if (typeof width === "undefined" || typeof height === "undefined") {
    throw new Error("Image has no defined width and height??");
  }

  try {
    // Generate a tiny text string that can be used to draw a blurred
    // version of the image while it loads on the front end
    let buffer = await img
      .clone()
      .raw()
      .ensureAlpha()
      .resize(width > height ? { width: 100 } : { height: 100 })
      .toBuffer({ resolveWithObject: true });
    const thumbhash = rgbaToThumbHash(
      buffer.info.width,
      buffer.info.height,
      new Uint8Array(buffer.data),
    );

    // Upsert asset record
    db.query(
      `
      INSERT INTO assets (asset_id, thumbhash, file_hash, last_modified)
      VALUES (@asset_id, @hash, @fileHash, @lastModified)
      ON CONFLICT(asset_id) DO UPDATE SET
        thumbhash = @hash,
        file_hash = @fileHash,
        last_modified = @lastModified
      `,
    ).run({
      "@asset_id": imageName,
      "@hash": thumbhash,
      "@fileHash": fileHash,
      "@lastModified": lastModified,
    });

    // Write the image to a file
    const outputFile = path.join(imagesDir, `${imageName}.png`);
    await img
      .resize({ width: 1800, withoutEnlargement: true })
      .clone()
      .jpeg({ quality: 90 })
      .toFile(outputFile);
  } catch (err) {
    console.error("Error processing image", err);
  }
}

async function processVideo(fileName: string) {
  const filePath = path.join(assetsDir, fileName);
  const videoName = encodeURI(path.parse(filePath).name);
  const fileHash = await calculateFileHash(filePath);
  const lastModified = await getFileModificationTime(filePath);

  const existingAsset = db
    .query("SELECT file_hash, last_modified FROM assets WHERE asset_id = ?")
    .get(videoName) as Asset | undefined;

  if (
    existingAsset &&
    existingAsset.file_hash === fileHash &&
    existingAsset.last_modified === lastModified
  ) {
    return; // Skip if unchanged
  }

  try {
    // Upsert asset record
    db.query(
      `
    INSERT INTO assets (asset_id, file_hash, last_modified)
    VALUES (@asset_id, @fileHash, @lastModified)
    ON CONFLICT(asset_id) DO UPDATE SET
      thumbhash = @hash,
      file_hash = @fileHash,
      last_modified = @lastModified
    `,
    ).run({
      "@asset_id": videoName,
      "@fileHash": fileHash,
      "@lastModified": lastModified,
    });

    // Write the video to a file
    const file = Bun.file(filePath);
    await Bun.write(path.join(videosDir, fileName), file);
  } catch (err) {}
}

async function processMarkdownFile(fileName: string) {
  const filePath = path.join(markdownDir, fileName);
  const contentHash = await calculateFileHash(filePath);
  const lastModified = await getFileModificationTime(filePath);

  // Check if file has changed
  const existingPost = db
    .query("SELECT content_hash, last_modified FROM posts WHERE title = ?")
    .get(fileName.replace(".md", "")) as Post | undefined;

  if (
    existingPost &&
    existingPost.content_hash === contentHash &&
    existingPost.last_modified === lastModified
  ) {
    return; // Skip if unchanged
  }

  const data = await readFile(filePath, "utf8");
  const filename = path.parse(filePath).name;
  const document = await parseMarkdown(data);

  // Write HTML file
  const outputHtmlPath = path.join(postsDir, `${document.metadata.name}.html`);
  await writeFile(outputHtmlPath, document.html);

  // Update database
  upsertPost(
    {
      // TODO: change id to be name in db?
      name: document.metadata.name,
      title: filename,
      created: document.metadata.created.toISOString().slice(0, 10),
      banner_image: document.metadata.banner
        ? encodeURI(document.metadata.banner?.match(/\[\[(.*?)\.\w+\]\]/)?.[1])
        : null,
      banner_alt: document.metadata.bannerAlt,
      content_hash: contentHash,
      last_modified: lastModified,
    },
    document.metadata.tags,
  );
}

async function build() {
  await ensureDir(postsDir);
  await ensureDir(imagesDir);
  await ensureDir(videosDir);
  await ensureSchema();

  // Process images
  const imageFiles = (await readdir(assetsDir)).filter((file) =>
    ["png", "jpg", "jpeg"].some((ext) => file.endsWith(ext)),
  );
  for (const fileName of imageFiles) {
    await processImage(fileName);
  }
  const videoFiles = (await readdir(assetsDir)).filter((file) =>
    file.endsWith(".mp4"),
  );
  for (const fileName of videoFiles) {
    await processVideo(fileName);
  }

  const markdownFiles = (await readdir(markdownDir)).filter((file) =>
    file.endsWith(".md"),
  );

  for (const file of markdownFiles) {
    await processMarkdownFile(file);
  }

  await cleanupDeletedFiles();
}

await build();

// Helpers
async function calculateFileHash(filePath: string) {
  const content = await readFile(filePath);
  return Bun.hash(content).toString(16).padStart(8, "0");
}

async function getFileModificationTime(filePath: string) {
  const stats = await stat(filePath);
  return stats.mtimeMs;
}

async function ensureSchema() {
  const path = "db/schema.sql";
  const file = Bun.file(path);

  const text = await file.text();
  db.run(text);
}

async function upsertPost(post: Post, tags: string[]) {
  const categoryFilePath = path.join(markdownDir, "tags.json");
  const categoryFile = Bun.file(categoryFilePath);
  if ((await categoryFile.text()) == "") {
    await categoryFile.write(JSON.stringify({}));
  }
  const categories = await categoryFile.json();

  await db.transaction(async () => {
    db.query(
      `
        INSERT INTO posts (name, title, created, banner_image, banner_alt, content_hash, last_modified)
        VALUES (@name, @title, @created, @banner_image, @banner_alt, @content_hash, @last_modified)
        ON CONFLICT(name) DO UPDATE
        SET title = excluded.title,
            created = excluded.created,
            banner_image = excluded.banner_image,
            banner_alt = excluded.banner_alt,
            content_hash = excluded.content_hash,
            last_modified = excluded.last_modified
        `,
    ).run({
      "@name": post.name,
      "@title": post.title,
      "@created": post.created,
      "@banner_image": post.banner_image,
      "@banner_alt": post.banner_alt,
      "@content_hash": post.content_hash,
      "@last_modified": post.last_modified,
    });

    // Update tags
    const postId = (
      db.query("SELECT post_id FROM posts WHERE name = ?").get(post.name) as {
        post_id: number;
      }
    )?.post_id;

    // Remove old tag-post relationships
    db.query("DELETE FROM post_tags WHERE post_id = ?").run(postId);

    const createTag = db.query(`
      INSERT INTO tags (name, category) VALUES (?1, ?2)
      ON CONFLICT(name) DO UPDATE SET
      	category = ?2
    `);

    // Add new tags
    const createTagRelationship = db.query(`
      INSERT INTO post_tags (post_id, tag_id)
      VALUES (?, (SELECT tag_id FROM tags WHERE name = ?))
    `);

    tags.forEach((tag) => {
      if (tag in categories && categories[tag] !== "") {
        createTag.run(tag, categories[tag]);
      } else {
        createTag.run(tag, null);
        categories[tag] = "";
      }
      createTagRelationship.run(postId, tag);
    });
  })();
  Bun.write(categoryFile, JSON.stringify(categories, null, 2));
}

async function cleanupDeletedFiles() {
  // Get list of current files
  const markdownFiles = new Set(
    (await readdir(markdownDir))
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(".md", "")),
  );

  const assetFiles = new Set(
    (await readdir(assetsDir))
      .filter((file) =>
        ["png", "jpg", "jpeg"].some((ext) => file.endsWith(ext)),
      )
      .map((file) => path.parse(file).name),
  );

  // Remove posts that no longer exist
  const existingPosts: string[] = db
    .query("SELECT title FROM posts")
    .all() as string[];
  for (const postName of existingPosts) {
    if (!markdownFiles.has(postName)) {
      db.query("DELETE FROM posts WHERE title = ?").run(postName);
      db.query(
        "DELETE FROM post_tags WHERE post_id IN (SELECT post_id FROM posts WHERE title = ?)",
      ).run(postName);
    }
  }
}
