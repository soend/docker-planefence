// Import components
import { Header } from "./components/header.js";
import { Footer } from "./components/footer.js";
import { Menu } from "./components/menu.js";

const STATION_INFO_KEY = "stationInfo";

export function loadStationInfo(init, initAutoRefresh, callback) {
  // Load station info
  $.getJSON("station-info.json").done(function (data) {
    if (callback && typeof callback === "function") {
      callback(data);
    }

    if (init) {
      updateHeader(data);
      updateFooter(data);

      if (initAutoRefresh && data["auto-refresh"] === "true") {
        if (parseInt(data["refresh-int"])) {
          startAutoRefresh(parseInt(data["refresh-int"]), callback);
        }
        else {
          startAutoRefresh(80, callback);
        }
      }
    }
  })
  .fail(function () {
    console.error("Failed to load station-info.json!");
  });
}

function startAutoRefresh(interval, callback) {
  console.log("Start auto refresh with interval", interval);
  window.setInterval(function() {
    loadStationInfo(false, callback);
  }, interval*1000);
}

function updateFooter(stationInfo) {
  const dataTags = ["build", "planefence-version"];
  const footerElem = $("#footer");
  dataTags.forEach(function(tag) {
    footerElem.find("data#"+tag).each(function(key, value) {
      $(value).html(stationInfo[tag]);
    });
  });

  $("footer-component").fadeIn(500);
}

function updateHeader(stationInfo) {
  const dataTags = ["station-name"];
  const headerElem = $("#header");
  dataTags.forEach(function(tag) {
    headerElem.find("data#"+tag).each(function(key, value) {
      $(value).html(stationInfo[tag]);
    });
  });
}