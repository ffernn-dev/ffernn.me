import Layout, { type PageProps } from "src/components/Layout";

export default function Projects() {
  const props: PageProps = {
    title: "Project Portfolio",
    url: "/projects",
    description: "A searchable collection of projects I've worked on",
  };
  const sidebarContent = (
    <div>
      <hr />
      <h2>Projects</h2>
      <form id="search-bar">
        <input type="text" id="search-text" placeholder="Search" />
        <button
          type="submit"
          id="search-submit"
          aria-label="Submit Search"
        ></button>
      </form>
      <h3>Filters:</h3>
      <form>
        <div id="filters"></div>
      </form>
    </div>
  );
  const page = (
    <article>
      <script src="https://unpkg.com/colcade@0/colcade.js"></script>
      <script src="/js/thumbhash.js"></script>
      <div id="posts-list">
        <div class="posts-col posts-col--1"></div>
        <div class="posts-col posts-col--2"></div>
        <div class="posts-col posts-col--3"></div>
      </div>
      <script src="/js/posts.js"></script>
    </article>
  );
  const stylesheets = [
    <link rel="stylesheet" type="text/css" href="/css/posts.css" />,
  ];
  return Layout(props, page, sidebarContent, stylesheets);
}
