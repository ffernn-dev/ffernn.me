import { getAnalyticsData } from "../analytics";

export default function Analytics() {
  const data = getAnalyticsData();
  console.log(data);
  return (
    <div>
      <h1>Analytics</h1>
      <h2>{data.length} Visits</h2>
      <div>
        <canvas id="visits"></canvas>
      </div>
    </div>
  );
}
