import type Database from "bun:sqlite";

type Tags = number[][];

export default function getProjects(tags: Tags, query: string, db: Database) {
  console.log(query);
  const stmt = `SELECT
     posts.*,
     GROUP_CONCAT(tags.tag_id, ',') AS tags,
     GROUP_CONCAT(tags.name, ', ') AS tagNames,
     assets.thumbhash AS thumbhash
   FROM
     posts
   JOIN
     post_tags ON posts.post_id = post_tags.post_id
   JOIN
     tags ON tags.tag_id = post_tags.tag_id
   LEFT JOIN
     assets ON assets.asset_id = posts.banner_image
   ${query ? "WHERE posts.name LIKE $query" : ""}
   GROUP BY
     posts.post_id
   ORDER BY
     posts.created DESC;`;

  const preparedStmt = db.prepare(stmt);
  const rows = preparedStmt.all({ $query: `%${query}%` });

  const filteredByTags = Array.isArray(tags) && tags.flat().length > 0;

  if (filteredByTags) {
    const result = rows.filter((item) => {
      item.tags = JSON.parse("[" + item.tags + "]"); // Parse tags as an array
      return tags.every((tagGroup) =>
        tagGroup.some((tag) => item.tags.includes(tag)),
      );
    });
    return result;
  }
  return rows;

  // Why is an empty object like {} considered "true" in js???
  // if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
  //   const rows = db
  //     .prepare(
  //       `SELECT
  //      posts.*,
  //      GROUP_CONCAT(tags.tag_id, ',') AS tags,
  //      GROUP_CONCAT(tags.name, ', ') AS tagNames,
  //      assets.thumbhash AS thumbhash
  //    FROM
  //      posts
  //    JOIN
  //      post_tags ON posts.post_id = post_tags.post_id
  //    JOIN
  //      tags ON tags.tag_id = post_tags.tag_id
  //    LEFT JOIN
  //      assets ON assets.asset_id = posts.banner_image
  //    GROUP BY
  //      posts.post_id
  //    ORDER BY
  //      posts.created DESC;`,
  //     )
  //     .all();
  //   res.json(rows);
  //   return;
  // }
  // const search = req.query;
  // let SQLTagList = "";
  // let tags;
  // if (search.tags) {
  //   tags = parseURLArray(search.tags);
  //   SQLTagList = JSON.stringify(tags.flat())
  //     .replace("[", "(")
  //     .replace("]", ")");
  // }
  // const query = search.q;

  // const SQLTextSearch = `AND posts.name LIKE '%${query}%'`;

  // // Get all the posts that match ANY of the given tags
  // let rows = db
  //   .prepare(
  //     `SELECT
  //      posts.*,
  //      GROUP_CONCAT(tags.tag_id, ',') AS tags,
  //      assets.thumbhash AS thumbhash
  //    FROM
  //      posts
  //    JOIN
  //      post_tags ON posts.post_id = post_tags.post_id
  //    JOIN
  //      tags ON tags.tag_id = post_tags.tag_id
  //    LEFT JOIN
  //      assets ON assets.asset_id = posts.banner_image
  //    WHERE
  //      ${SQLTagList ? "tags.tag_id IN" + SQLTagList : "TRUE"}
  //      ${query ? SQLTextSearch : ""}
  //    GROUP BY
  //      posts.post_id
  //    ORDER BY
  //      posts.created DESC;`,
  //   )
  //   .all();

  // // Filter them so that at least one tag from each category is present.
  // if (search.tags) {
  //   const tagGroups = tags.map((tag) => (Array.isArray(tag) ? tag : [tag]));

  //   rows = rows.filter((item) => {
  //     item.tags = JSON.parse("[" + item.tags + "]"); // Parse tags as an array
  //     return tagGroups.every((tagGroup) =>
  //       tagGroup.some((tag) => item.tags.includes(tag)),
  //     );
  //   });
  // }
  // res.json(rows);
}
