import Layout, { type PageProps } from "src/components/Layout";
import type Database from "bun:sqlite";
import { type Post } from "src/build";
import fs from "fs";
import path from "path";

export default function Project(id: string, db: Database) {
  const project = db
    .query("SELECT * FROM posts WHERE name = ?")
    .get(id) as Post;
  const projectFile = path.join(
    "src",
    "content",
    "posts",
    project.name + ".html",
  );
  const projectHTML = fs.readFileSync(projectFile, {
    encoding: "utf8",
    flag: "r",
  });

  const props: PageProps = {
    title: project.title,
    url: "/projects",
    description: project.title,
    embedImage: project.banner_image || "",
  };
  const hasBanner =
    typeof project.banner_image !== "undefined" &&
    project.banner_image !== null;
  const page = (
    <article>
      <a href="/projects" class="url inlineurl" id="backbutton">
        ← Back to all projects
      </a>
      {hasBanner && (
        <img
          class="banner"
          src={"/images/" + project.banner_image + ".png"}
          alt={project.banner_alt}
        />
      )}
      <header class="project-header">
        <h1>{project.title}</h1>
        {project.created && <p>{project.created}</p>}
      </header>
      <div
        class="project-content"
        dangerouslySetInnerHTML={{ __html: projectHTML }}
      />
    </article>
  );
  return Layout(props, page);
}
