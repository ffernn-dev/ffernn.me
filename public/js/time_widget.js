import { now, fromDate } from "https://cdn.skypack.dev/dot-beat-time";

function getSydneyTime() {
  const options = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Australia/Sydney",
    timeZoneName: "short",
  };

  const userLocale = navigator.language;
  const formatter = new Intl.DateTimeFormat(userLocale, options);
  return formatter.format(new Date());
}

document.addEventListener("DOMContentLoaded", function () {
  const widgetBox = document.getElementById("widgets");
  const sydneyTime = document.createElement("p");
  sydneyTime.innerHTML = "My time: " + getSydneyTime();
  const internetTime = document.createElement("p");
  internetTime.innerHTML = "Internet time: " + now();

  widgetBox.appendChild(sydneyTime);
  widgetBox.appendChild(internetTime);
});

console.log(getSydneyTime()); // Example: "11:49 am AEST"
