import { loadStationInfo } from "../common.js";

function initPlanesTable() {
  //$("#planes-table").tablesorter({sortList: [[0,1]]});
  sortTable($("#planes-table").get(0), 6, -1);
}

function updatePlanesTable(data) {
  if (!data) {
    return;
  }

  const tbodyElem = $("#planes-table").find("tbody");
  tbodyElem.empty();

  data.sort((a,b) => Date.parse(b["date"] + " " + b["time"]) - Date.parse(a["date"] + " " + a["time"]));

  $.each(data, function(key, value) {
    tbodyElem.append(`
        <tr>
            <td>`+(key+1)+`</td>
            <td><img class="plane-alert-icon" src="../plane-alert/silhouettes/`+value["icaotype"]+`.bmp"></td>
            <td><a target="_blank" href="`+value["adsbx_link"]+`">`+value["hex_id"]+`</a></td>
            <td><a target="_blank" href="https://flightaware.com/live/modes/`+value["hex_id"]+`/ident/`+value["call"]+`/redirect">`+value["tail"]+`</a></td>
            <td>`+value["name"]+`</td>
            <td>`+value["equipment"]+`</td>
            <td>`+value["date"]+` `+value["time"]+`</td>
            <td><a target="_blank" href="`+value["adsbx_link"]+`">`+value["lat"]+` `+value["lon"]+`</a></td>
            <td>`+value["call"]+`</td>
            <td>`+value["icaotype"]+`</td>
        </tr>
    `);
  });
}

function startAutoRefresh(interval) {
  console.log("Start auto refresh with interval", interval);
  window.setInterval(function() {
    loadPlaneLogData();
  }, interval*1000);
}

function loadData(init) {
  console.log("Load data..");

  // Load station info
  loadStationInfo(init, false, function(stationInfo) {
    // If auto refresh enabled, refresh table
    if (stationInfo["auto-refresh"] === "true") {
      if (parseInt(stationInfo["refresh-int"])) {
        startAutoRefresh(parseInt(stationInfo["refresh-int"]));
      }
      else {
        startAutoRefresh(80);
      }
    }
  });

  loadPlaneLogData();
}

function loadPlaneLogData() {
  const d = new Date();
  const dateSring = d.getFullYear().toString() + "/*";
  // Load last 5 planes from log
  $.get("../plane-alerts/pa_query.php", { timestamp: dateSring }).done(function (data) {
      // There is problems if API call result is not json array
      if (!Array.isArray(data)) {
        console.error("Something went wrong with pa_query.php call!");
        return;
      }

      updatePlanesTable(data);
    })
    .fail(function () {
      console.error("Failed to load plane log data!");
      // Use test data
      //loadPlaneLogTestData();
    });
}

$(window).on("load", function () {
  loadData(true);

  initPlanesTable();
});
