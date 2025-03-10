import { Elysia, t } from "elysia";
import { Database } from "bun:sqlite";
import { staticPlugin } from "@elysiajs/static";
import { html, Html } from "@elysiajs/html";
import { renderToString } from "preact-render-to-string";
import type { JSXInternal } from "node_modules/preact/src/jsx";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import getProjects from "./getProjects";
import Socials from "./pages/Socials";
import Blog from "./pages/Blog";

function render(element: JSXInternal.Element): string {
  return "<!DOCTYPE html>\n" + renderToString(element);
}
function parseURLArray(input: string) {
  return JSON.parse("[" + input.replace(/\(/g, "[").replace(/\)/g, "]") + "]");
}

const db = new Database("db/content.sqlite", { create: true });

const app = new Elysia()
  .use(
    staticPlugin({
      prefix: "/",
      assets: "public",
      indexHTML: false,
      noCache: false, // temporary because of https://github.com/elysiajs/elysia/issues/739
    }),
  )
  .use(html())
  .get("/", () => render(Home()))
  .get("/about", () => render(About()))
  .get("/projects", () => render(Projects()))
  .get("/socials", () => render(Socials()))
  .get("/blog", () => render(Blog()))
  .get("/project/:id", ({ params: { id } }) => render(Project(id, db)))
  .get(
    "/api/projects",
    ({ query: { tags, q } }) => {
      let parsedTags: number[][] = [];
      if (tags) {
        parsedTags = JSON.parse(tags.replaceAll("(", "[").replaceAll(")", "]"));
      }
      return getProjects(parsedTags, q || "", db);
    },
    {
      query: t.Object({
        tags: t.Optional(t.String()),
        q: t.Optional(t.String()),
      }),
    },
  )
  .get("/api/tags", () => {
    const rows = db
      .prepare("SELECT * FROM tags ORDER BY tags.category DESC")
      .all();
    return rows;
  })
  .listen(process.env.HTTP_PORT || 3000);

console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port} on Bun ${Bun.version}. Startup took ${Bun.nanoseconds() / 1000000000} seconds`,
);
