import Layout, { type PageProps } from "src/components/Layout";

export default function Analytics() {
  const props: PageProps = {
    title: "Analytics",
    url: "/analytics",
    description: "Basic stats tracking for the various pages of this site.",
  };

  const page = (
    <article>
      <h1>A Very Barebones Analytics Page</h1>
      <script src="/js/analytics.js" />
      <div id="metrics-bar">
        <div id="views-card" class="metric-card">
          <div class="MetricCard_label">Views</div>
          <div class="MetricCard_value" title="0">
            0
          </div>
        </div>
        <div id="visits-card" class="metric-card">
          <div class="MetricCard_label">Unique Visits</div>
          <div class="MetricCard_value" title="0">
            0
          </div>
        </div>
      </div>
    </article>
  );
  const stylesheets = [
    <link rel="stylesheet" type="text/css" href="/css/analytics.css" />,
  ];
  return Layout(props, page, stylesheets);
}
