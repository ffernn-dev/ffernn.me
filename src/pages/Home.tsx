import Layout, { type PageProps } from "src/components/Layout";
import Header from "src/components/Header";

export default function Home() {
  const props: PageProps = {
    url: "/",
    description: "Personal site, Blog and Portfolio",
  };
  const page = (
    <article>
      <Header />
      <p>
        Hi! I'm Fern, <small class="aside">(sometimes known as ffernn)</small>
      </p>
      <p>
        I'm a <span class="red-text">software developer</span> |{" "}
        <span class="yellow-text">tinkerer</span> |{" "}
        <span class="green-text">musician</span> |{" "}
        <span class="blue-text">student</span> |{" "}
        <span class="pink-text">ameteur astronomer</span>, and this is my little
        home on the web.
      </p>
      <p>
        Here you can find a portfolio of the many things that I've made (or
        started to make), links to my social media accounts, and at some point
        in the future a blog full of my ramblings. Enjoy your stay and feel free
        to reach out and say hi!
      </p>
      <hr />
      <div id="footer">
        <div id="bucket-webring">
          <span id="left">
            ⥼{" "}
            <a
              href="https://webring.bucketfish.me/redirect.html?to=prev&amp;name=Fern"
              id="prev"
              class="url"
            >
              prev
            </a>
          </span>
          <span id="mid">
            {" "}
            🏳️‍🌈{" "}
            <a href="https://webring.bucketfish.me" id="header" class="url">
              bucket webring
            </a>{" "}
            🏳️‍🌈{" "}
          </span>
          <span id="right">
            <a
              href="https://webring.bucketfish.me/redirect.html?to=next&amp;name=Fern"
              id="next"
              class="url"
            >
              next
            </a>{" "}
            ⥽
          </span>
          <span
            class="help"
            data-tooltip="A webring is a community of websites that link to each other, a staple of early web culture."
            role="tooltip"
            tabindex={0}
            aria-label="Help: A webring is a community of websites that link to each other, a staple of early web culture."
          >
            ?
          </span>
        </div>
        <p id="footertext">© Copyright 2025 Fern</p>
      </div>
    </article>
  );
  return Layout(props, page);
}
