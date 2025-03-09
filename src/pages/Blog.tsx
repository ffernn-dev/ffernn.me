import Header from "src/components/Header";
import Layout, { type PageProps } from "src/components/Layout";

export default function Blog() {
  const props: PageProps = {
    title: "Blog (UNDER CONSTRUCTION)",
    url: "/blog",
    description: "Blog",
  };
  const page = (
    <article>
      <section style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <h2>The Blog is under construction!</h2>
        <img src="/images/construction.gif" alt="Under Construction" />
        <h2>Check back soon</h2>
      </section>
    </article>
  );
  return Layout(props, page);
}
