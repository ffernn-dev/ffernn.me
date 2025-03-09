import {
  marked,
  type TokenizerAndRendererExtension,
  type Tokens,
} from "marked";
import matter from "gray-matter";

interface ParsedMarkdown {
  html: string;
  metadata: { [key: string]: any };
}

export async function parseMarkdown(markdown: string): Promise<ParsedMarkdown> {
  const document = matter(markdown);

  const customTokenizer = {
    link(src: string): Tokens.Image | Tokens.HTML | false {
      // Handle Obsidian-style ![[image.png]] and ![[video.mp4]]
      const match = src.match(/^\!\[\[(.*?)\]\]$/);
      if (match) {
        const filename = match[1];

        if (/\.(png|jpe?g|gif|svg|webp)$/i.test(filename)) {
          // Image handling
          return {
            type: "image",
            raw: match[0],
            href: `/images/${filename}`,
            title: null,
            text: filename,
          };
        } else if (/\.mp4$/i.test(filename)) {
          // Video handling
          return {
            type: "html",
            raw: match[0],
            text: `<video controls><source src="/videos/${filename}" type="video/mp4; codecs=av01.0.09M.10.0.110.09.18.09.0"></video>`,
            pre: false,
            block: true,
          };
        }
      }
      return false;
    },
  };

  marked.use({ tokenizer: customTokenizer });
  const renderer = new marked.Renderer();

  renderer.image = function ({ href, title, text }) {
    const url = href.startsWith("http") ? href : `${href}`;
    return `<img src="${url}" alt="${text}" title="${title}" />`;
  };

  renderer.link = function ({ href, title, tokens }) {
    const innerContent = this.parser.parseInline(tokens);

    return `<a class='url inlineurl' href="${href}" title="${title || ""}">${innerContent}</a>`;
  };

  renderer.blockquote = function ({ tokens }: Tokens.Blockquote): string {
    const body = this.parser.parse(tokens);
    if (body.trim().startsWith("<p>[!url]")) {
      const url = body.trim().replace("[!url]", "").trim();
      const newHTML = url.replace(
        "<p>",
        `<p><svg class="outlink-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="216 104 215.99 40.01 152 40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="136" y1="120" x2="216" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M184,136v72a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`,
      );
      return `<blockquote class="callout">\n${newHTML}</blockquote>\n`;
    }
    return `<blockquote>\n${body}</blockquote>\n`;
  };

  const html = await marked(document.content, { renderer });
  const metadata = document.data;
  return { html, metadata };
}
