import { loadStationInfo } from "../common.js";

function initPlanesTable() {
  //$("#planes-table").tablesorter({sortList: [[0,1]]});
  sortTable($("#planes-table").get(0), 4, -1);
}

function updatePlanesTable(data) {
  if (!data) {
    return;
  }

  const tbodyElem = $("#planes-table").find("tbody");
  tbodyElem.empty();

  data.sort((a,b) => Date.parse(b["end_time"]) - Date.parse(a["end_time"]));

  $.each(data, function(key, value) {
      tbodyElem.append(`
          <tr>
              <td>`+(key+1)+`</td>
              <td><a target="_blank" href="`+value["adsbx_link"]+`">`+value["hex_id"]+`</a></td>
              <td><a target="_blank" href="https://flightaware.com/live/modes/`+value["hex_id"]+`/ident/`+value["callsign"]+`/redirect">`+value["callsign"]+`</a></td>
              <td>`+value["start_time"]+`</td>
              <td>`+value["end_time"]+`</td>
              <td>`+value["min_alt"]+` m AGL</td>
              <td>`+value["min_dist"]+` km</td>
          </tr>
      `);
  });
}

function loadData(init) {
  console.log("Load data..");

  // Load station info
  loadStationInfo(init, true, function(stationInfo) {
    loadPlaneLogData();
  });
}

function loadPlaneLogData() {
  const d = new Date();
  const dateSring = d.getFullYear().toString() + "/" + (d.getMonth() + 1).toString().padStart(2, '0') + "/" + d.getDate().toString().padStart(2, '0');
  // Load last 5 planes from log
  $.get("../pf_query.php", { start: dateSring }).done(function (data) {
      // There is problems if API call result is not json array
      if (!Array.isArray(data)) {
        console.error("Something went wrong with pf_query.php call!");
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

// remove me, just for loading test data
/*function loadPlaneLogTestData() {
  $.getJSON("plane-log/plane-log_test-data.json").done(function (data) {
      updatePlanesTable(data);
  });
}*/

$(window).on("load", function () {
  loadData(true);

  initPlanesTable();
});
