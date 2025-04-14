window.addEventListener("load", main);

async function main() {
	try {
    const response = await fetch("/api/analytics");
    if (!response.ok) {
      throw new Error(`Couldn't fetch analytics data: ${response.status}`);
    }

    const json = await response.json();

    const viewsCard = document.querySelector("#views-card > div:nth-child(2)")
    const visitsCard = document.querySelector("#visits-card > div:nth-child(2)")
    console.log(json.views)
    viewsCard.innerHTML = json.views;
    viewsCard.title = json.views;
    visitsCard.innerHTML = json.visits;
    viewsCard.title = json.visits;
	} catch (error) {
	  console.error(error.message);
	}
}
