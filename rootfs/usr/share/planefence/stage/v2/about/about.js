import { loadStationInfo } from "../common.js";

function loadAttributions() {
    $("#attribution").html("Loading...").load("attribution.txt");
}

function loadData(init) {
  console.log("Load data..");

  loadStationInfo(init, false);
}

$(window).on("load", function () {
  loadData(true);

  loadAttributions();
});
