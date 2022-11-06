const host = "https://api.data.gov.in/";
const resource = "resource/9ef84268-d588-465a-a308-a864a43d0070";
const statess = [];

let params = new URLSearchParams();
const comm = [];
params.append(
  "api-key",
  "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
);
params.append("format", "json");
let capturedRecords = 0;
function fetchData(offset, onComplete) {
  params.set("offset", offset);
  fetch(
    host +
      resource +
      "?" +
      params.toString() +
      "&filters[state]=" +
      encodeURI(searchStates.value)
  )
    .then((response) => response.json())
    .then((result) => {
      console.log("Fetching data.....");
      console.dir(result);
      document.querySelector("#last-update-date").innerHTML =
        "Last updated on : " + result.updated_date;
      result.records.forEach((record) => Builder.load(statess, record));
      if (result.total == 0) {
        alert("Sorry data not found for selected state, select another one");
        return;
      }
      capturedRecords += result.count;
      if (capturedRecords == result.total) {
        onComplete();
        console.log("Fecthing completed");
      } else {
        let remainig = result.total - capturedRecords;
        console.log(result.total, offset);
        if (remainig >= 10) fetchData(offset + 10, onComplete);
        else if (remainig < 10) fetchData(offset + 10, onComplete);
        else {
          onComplete();
          console.log("fecthing completed");
        }
      }
    });
}

var currentState = null;
const searchStates = document.querySelector("#State");
const searchDistricts = document.querySelector("#District");
const searchMarkets = document.querySelector("#Market");
const commoditiesHost = document.querySelector("#commodities-list");
searchStates.innerHTML = statesList
  .map((name) => `<option>${name}</option>`)
  .join("");
searchStates.value = "";
searchDistricts.value = "";
searchMarkets.value = "";

function onStateChanged(value) {
  currentState = statess.find((s) => s.name == value);
  searchDistricts.value = "";
  searchMarkets.value = "";
  if (typeof currentState == "undefined") {
    capturedRecords = 0;
    fetchData(0, () => {
      currentState = statess.find((s) => s.name == value);
      searchDistricts.innerHTML = currentState.districts
        .map((name) => `<option>${name.name}</option>`)
        .join("");
      searchDistricts.value = "";
      searchMarkets.value = "";
    });
  } else {
    searchDistricts.innerHTML = currentState.districts
      .map((name) => `<option>${name.name}</option>`)
      .join("");
    searchDistricts.value = "";
    searchMarkets.value = "";
  }
}
function onDistrictSelected(value) {
  searchMarkets.innerHTML = currentState.districts
    .find((d) => d.name == value)
    .markets.map((name) => `<option>${name.name}</option>`)
    .join("");
}
function displayCommodities() {
  commoditiesHost.innerHTML = currentState.districts
    .find((d) => d.name == searchDistricts.value)
    .markets.find((m) => m.name == searchMarkets.value)
    .commodities.map((c) => {
      return `<tr>
                <td>${c.name}</td>
                <td>${c.variety}</td>
                <td>${c.min_price}</td>
                <td>${c.max_price}</td>
                <td>${c.modal_price}</td>
                <td>${Builder.FromToday(c.arrival_date)}</td>
                </tr>`;
    })
    .join("");
  return false;
}
