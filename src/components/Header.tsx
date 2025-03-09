export default function Header({ short = false }) {
  return (
    <header>
      <div class="captioned-image">
        <img
          class={`banner ${short ? "banner-short" : ""}`}
          alt="fern's profile picture"
          src="/images/fern-banner.png"
        />
        <span class="image-attribution">
          Art by{" "}
          <a href="https://bucketfish.me" target="_blank" class="url inlineurl">
            bucketfish
          </a>
          , used under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            class="url inlineurl"
          >
            CC BY 4.0
          </a>
        </span>
      </div>
      <div class="header-text-flex">
        <h1>fern!</h1>
        <a class="url email aside" href="mailto:hihi.fernguy@gmail.com">
          hihi.fernguy@gmail.com
        </a>
      </div>
      <hr />
    </header>
  );
}
