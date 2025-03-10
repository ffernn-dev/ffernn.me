import Header from "src/components/Header";
import Layout, { type PageProps } from "src/components/Layout";

export default function Socials() {
  const props: PageProps = {
    title: "Socials",
    url: "/socials",
    description: "Social media links",
  };
  const page = (
    <article id="socials">
      <Header short />
      <div class="list-button">
        <a
          href="https://github.com/ffernn-dev"
          class="button-href"
          id="github-button"
        >
          <div class="icon-holder">
            <svg viewBox="0 0 98 96" class="button-logo">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                fill="#f7fff7"
              />
            </svg>
          </div>
          <span class="label">Github</span>
        </a>
      </div>
      <div class="list-button">
        <a
          href="https://www.youtube.com/channel/UCML242reim253tInH3ClhOA"
          class="button-href"
          id="youtube-button"
        >
          <div class="icon-holder">
            <svg viewBox="0 0 121.485 85.039" class="button-logo">
              <path
                class="svg"
                xmlns="https://www.w3.org/2000/svg"
                d="M118.9,13.3L118.9,13.3c-1.4-5.2-5.5-9.3-10.7-10.7C98.7,0,60.7,0,60.7,0s-38,0-47.5,2.5C8,3.9,3.9,8,2.5,13.3  C0,22.8,0,42.5,0,42.5s0,19.8,2.5,29.2C3.9,77,8,81.1,13.3,82.5C22.8,85,60.7,85,60.7,85s38,0,47.5-2.5c5.2-1.4,9.3-5.5,10.7-10.7  c2.5-9.5,2.5-29.2,2.5-29.2S121.5,22.8,118.9,13.3z M48.6,60.7V24.3l31.6,18.2L48.6,60.7z"
                fill="#f7fff7"
              />
            </svg>
          </div>
          <span class="label">Youtube</span>
        </a>
      </div>
      <div class="list-button">
        <a
          href="https://www.tumblr.com/ffernn-things"
          class="button-href"
          id="twitter-button"
        >
          <div class="icon-holder">
            <svg viewBox="0 0 90.2 159.3" class="button-logo">
              <path
                d="M-633.1-147.5c-24 0-41.8-12.3-41.8-41.8v-47.2h-21.8v-25.6c24-6.2 34-26.8 35.1-44.7h24.9v40.6h29v29.7h-29v41.1c0 12.3 6.2 16.6 16.1 16.6h14.1v31.3h-26.6zm89.1 1.4c13.6 0 29.3-5.9 37.8-16.4v15h44.8V-173h-11.4v-93.3H-527v25.9h15.4v44.9c0 3.6-3 18.7-23.3 18.7-13 0-15.4-7.8-15.4-17.7v-71.8h-39.9v73.4c.1 18.3 8.4 46.8 46.2 46.8zm96.9-1.4h65.6V-173h-13.4v-44.4c0-6.5 5.5-19.7 22.4-19.7 13.6 0 16.4 8.3 16.4 18.1v46h-13.2v25.5h65.1V-173H-318v-44.4c0-6.5 5-19.7 21.9-19.7 13.7 0 17.1 8.3 17.1 18.1v46h-13v25.5h64.8V-173h-13.3v-41.5c0-24.4-9.2-53.2-45.6-53.2-18 0-32.7 8.5-38.9 19-7.8-11.9-19.7-19-37.4-19-14.1 0-29.5 6-37.8 17.4v-16h-49.2v25.9h15.9v67.4H-447v25.5zm303 1.4c33.2 0 51-24.9 51-62.2 0-35.8-16.6-59.3-50.3-59.3-11.9 0-23.7 4.5-30.9 10v-49.2h-54.8v25.7h15.9v133.6h36.5V-158a50 50 0 0 0 32.6 11.9zm-8.3-29c-11.6 0-23-7.4-23-30.6 0-28 13.5-33 22.8-33 10.8 0 20.4 8.8 20.4 30.5-.1 31.4-14.1 32.4-20.2 33.1zm66.5 27.6h66V-173H-34v-133.9h-54.4v25.7h15.9V-173H-86v25.5zm80.4 0h64.9V-173H46.1v-33.2c0-22.6 15.9-27.5 28-27.5h16.1v-34h-13c-14.7 0-28.3 7.1-34.4 18.5v-17.2H-6.7v25.9H7.6v67.4H-5.5v25.6zm69.1 306.8c-24 0-41.8-12.3-41.8-41.8V70.3H0V44.7C24 38.5 34 17.9 35.1 0H60v40.6h29v29.7H60v41.1c0 12.3 6.2 16.6 16.1 16.6h14.1v31.3H63.6zm-354.4-158c-43.4 0-78.6 35.1-78.6 78.3s35.1 78.5 78.6 78.5c43.2 0 78.3-35.3 78.3-78.5 0-43.4-35.1-78.3-78.3-78.3z"
                fill="#f7fff7"
              />
            </svg>
          </div>
          <span class="label">Tumblr</span>
        </a>
      </div>
    </article>
  );
  return Layout(props, page);
}
