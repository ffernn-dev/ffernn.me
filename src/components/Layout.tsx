import type { JSX } from "preact/jsx-runtime";

export interface PageProps {
  title?: string;
  description?: string;
  url?: string;
  embedImage?: string;
}

const sidebarItems = [
  { label: "Home", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "Social Links", href: "/socials" },
  { label: "Project Portfolio", href: "/projects" },
  { label: "Blog", href: "/blog" },
];

export default function Layout(
  props: PageProps,
  content: JSX.Element,
  sidebarContent?: JSX.Element,
  stylesheets?: JSX.Element[],
) {
  const title = props.title ? props.title : false;
  const description = props.description ? props.description : "";
  const url = props.url ? props.url : "";
  const embedImage = props.embedImage ? props.embedImage : false;

  const pageTitle = title ? `${title} || ffernn` : "Fern!";
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="manifest"
          href="/manifest.json"
          crossorigin="use-credentials"
        />
        <link rel="stylesheet" type="text/css" href="/css/index.css" />
        {stylesheets}
        <title>{pageTitle}</title>
        <meta content={pageTitle} property="og:title" />
        <meta content={description} property="og:description" />
        {embedImage && <meta content={embedImage} property="og:image" />}
        <meta content={url} property="og:url" />
        <meta content="#38B863" name="theme-color" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:site" content="@ffernn" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={description} />
        {embedImage && <meta name="twitter:image" content={embedImage} />}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <meta name="application-name" content="ffernn.me" />
        <meta name="apple-mobile-web-app-title" content="ffernn" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icons/icon128_maskable.png" />{" "}
      </head>
      <body style="background-color: #1c1a1e">
        <div id="main">
          <div class="sidebar box">
            <h2>fern!</h2>
            <ul>
              {sidebarItems.map((item) => (
                <li
                  key={item.href}
                  className={
                    url.endsWith(item.href)
                      ? "active sidebar-page"
                      : "sidebar-page"
                  }
                >
                  <a className="link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
              {sidebarContent || null}
            </ul>
          </div>
          <div class="content-container">
            <div class="content box">{content}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
