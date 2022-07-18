"use strict";

let heatLayer;

function updateStationInfo(stationInfo) {
  if (!stationInfo) {
    return;
  }

  $(".card").fadeOut(100);

  const dataTags = ["last-update", "distance", "station-location-link", "max-altitude", "messages-received", "map-url"];

  const stationInfoElem = $("#station-info");
  dataTags.forEach(function(tag) {
    let tagValue = stationInfo[tag];

    if (tag === "map-url" && stationInfo[tag] !== "") {
      tagValue = '<a id="card-footer-map-link" href="'+stationInfo[tag]+'" target="_blank">Live map</a>'
    }

    if (tag === "station-location-link") {
      tagValue = '<a target="_blank" href="https://www.openstreetmap.org/?mlat='+stationInfo["station-lat"]+'&mlon='+stationInfo["station-lon"]+'#map=14/'+stationInfo["station-lat"]+'/'+stationInfo["station-lon"]+'&layers=H">'+stationInfo["station-lon"]+'</data>°N, '+stationInfo["station-lon"]+'</data>°E</a>';
    }

    stationInfoElem.find("data#"+tag).each(function(key, value) {
      $(value).html(tagValue);
    });
  });


  $(".card").fadeIn(500);
}

function updateMostRecentPlanes(data) {
  const ulElem = $("#recent-planes-list");
  ulElem.empty();

  data.sort((a,b) => Date.parse(b["end_time"]) - Date.parse(a["end_time"]));

  $.each(data, function(key, value) {
    ulElem.append(`
      <li>
        Transponder ID: <a target="_blank" href="`+ value["adsbx_link"] +`">`+ value["hex_id"] +`</a>,
        Flight: <a target="_blank" href="https://flightaware.com/live/modes/`+ value["hex_id"] +`/ident/`+ value["callsign"] +`/redirect">`+ value["callsign"] +`</a>
        <br/>
        <span class="has-text-grey is-size-7">First seen: `+ value["start_time"] +`, Last seen: `+ value["end_time"] +`</span>
      </li>`
    );
  });
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

  //$("header-component").fadeIn(500);
}

function initMap() {
  var map = L.map("map").setView(
    [parseFloat("59.422"), parseFloat("24.748")],
    parseInt("9")
  );

  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution: '<a href="https://github.com/Leaflet/Leaflet.heat">Leaflet.heat</a>, &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.circle([parseFloat("59.422"), parseFloat("24.748")], {
    color: "blue",
    fillColor: "#f03",
    fillOpacity: 0.1,
    radius: 20000.0,
  }).addTo(map);

  // This var comes from heatmapdata-*.js file
  addressPoints = addressPoints.map(function (p) { return [p[0], p[1]]; });

  heatLayer = L.heatLayer(addressPoints, {
    minOpacity: 1,
    radius: 7,
    maxZoom: 14,
    blur: 11,
    attribution: "<a href=https://github.com/kx1t/docker-planefence target=_blank>docker:kx1t/planefence</a>",
  }).addTo(map);
}

function updateMap() {
  addressPoints = addressPoints.map(function (p) { return [p[0], p[1]]; });
  heatLayer.setLatLngs(addressPoints);
}

function initCards() {
  $(document).on('click', '.card-toggle', function (){
    $(this).parent().parent().children(".card-content").toggleClass("is-hidden");
    $(this).parent().children(".card-header-title").children(".card-header-info")?.toggleClass("is-hidden");
  });
}

function initAutoRefresh(interval) {
  console.log("Start auto refresh with interval", interval);
  window.setInterval(function() {
    loadData(false);
  }, interval*1000);
}

async function loadData(init) {
  console.log("Load data..");
  // Load heatmap data
  const d = new Date();
  const dateSring = d.getFullYear().toString().slice(-2) + (d.getMonth() + 1).toString().padStart(2, '0') + d.getDate().toString().padStart(2, '0');

  $.getScript("../planeheatdata-" + dateSring + ".js").done(function(data) {
    if (init) {
      initMap(data);
    }
    else {
      updateMap();
    }
  }).fail(function() {
    console.error("Failed to load heatmap data!");
  });

  // Load station info
  $.getJSON("station-info.json").done(function(data) {
    updateStationInfo(data);

    if (init) {
      updateHeader(data);
      updateFooter(data);

      if (data["auto-refresh"] === "true") {
        if (parseInt(data["refresh-int"])) {
          initAutoRefresh(parseInt(data["refresh-int"]));
        }
        else {
          initAutoRefresh(80);
        }
      }
    }
  }).fail(function() {
    console.error("Failed to load station-info.json!");
  });

  // Load last 5 planes from log
  $.get("../pf_query.php", { top: 5 }).done(function(data) {
    // There is problems if API call result is not json array
    if (!Array.isArray(data)) {
      console.error("Something went wrong with pf_query.php call!");
      return;
    }

    updateMostRecentPlanes(data);
  }).fail(function() {
    console.error("Failed to load plane log data!");
  });
}

$(window).on('load', function() { 
  loadData(true);

  initCards();
 });
