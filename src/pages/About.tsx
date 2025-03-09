import Header from "src/components/Header";
import Layout, { type PageProps } from "src/components/Layout";

export default function About() {
  const props: PageProps = {
    title: "About Me",
    url: "/about",
    description: "About ffernn",
  };
  const page = (
    <article>
      <Header short />
      <script src="/js/age.js" />
      <h1>About me</h1>
      <p>
        Hi! I'm{" "}
        <span id="age">
          <noscript>17</noscript>
        </span>{" "}
        years old and I was born and live in Australia. I love making things! I
        do a little bit of everything (see my{" "}
        <a href="/projects" class="url inlineurl">
          portfolio page
        </a>
        ) but here's an incomplete list of my hobbies:
      </p>
      <ul>
        <li>
          Software development, including
          <ul>
            <li>Web development</li>
            <li>Game development</li>
            <li>Embedded programming</li>
            <li>
              Bash scripting to automate tasks that would take me 5 minutes
            </li>
          </ul>
        </li>
        <li>
          Music production, I haven't released much but I've recently started a
          rock band with friends so watch this space!
        </li>
        <li>3D art, primarily VFX and architecture renders</li>
        <li>Electronics and embedded systems</li>
      </ul>
      <p>
        As you can probably tell, I love to try my hand at whatever new
        challenges or ideas come my way, and I'm always eager to learn something
        new. I'm making my way through my last year of high school, and I can't
        wait to get to work on my grander ideas so I can share them with the
        world!
      </p>
      <h2>Gender Identity & Pronouns</h2>
      <p>
        I identify as genderfluid, which means my gender isn't fixed. Sometimes
        I feel more male, sometimes female, sometimes both or neither. In terms
        of pronouns, use whatever you want! People often use he/him though as I
        was born male :) My{" "}
        <a href="https://en.pronouns.page/@hihi.fernguy" class="url inlineurl">
          pronouns.page
        </a>{" "}
        has more details if you're interested.
      </p>
      <h2>Currently into:</h2>
      <ul>
        <li>Astronomy & Astrophotography 🔭</li>
        <li>
          The music of
          <ul>
            <li>Porter Robinson</li>
            <li>Sting & The Police</li>
            <li>Peach Pit</li>
          </ul>
        </li>
        <li>Bouldering!</li>
      </ul>
    </article>
  );
  return Layout(props, page);
}
