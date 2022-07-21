"use strict";

function updateFooter(stationInfo) {
  const dataTags = ["build", "planefence-version"];
  const footerElem = $("#footer");
  dataTags.forEach(function (tag) {
    footerElem.find("data#" + tag).each(function (key, value) {
      $(value).html(stationInfo[tag]);
    });
  });

  $("footer-component").fadeIn(500);
}

function updateHeader(stationInfo) {
  const dataTags = ["station-name"];
  const headerElem = $("#header");
  dataTags.forEach(function (tag) {
    headerElem.find("data#" + tag).each(function (key, value) {
      $(value).html(stationInfo[tag]);
    });
  });
}

function loadAttributions() {
    $("#attribution").html("Loading...").load("attribution.txt");
}

function loadData(init) {
  console.log("Load data..");

  // Load station info
  $.getJSON("station-info.json")
    .done(function (data) {
      if (init) {
        updateHeader(data);
        updateFooter(data);

        if (data["auto-refresh"] === "true") {
          if (parseInt(data["refresh-int"])) {
            initAutoRefresh(parseInt(data["refresh-int"]));
          } else {
            initAutoRefresh(80);
          }
        }
      }
    })
    .fail(function () {
      console.error("Failed to load station-info.json!");
    });
}

$(window).on("load", function () {
  loadData(true);

  loadAttributions();
});
