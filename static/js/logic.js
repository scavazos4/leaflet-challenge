// create map layer
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// Create map 
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 3,

});

satellitemap.addTo(myMap);

// API url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl, function(data) {
  console.log(data)


  // creating style 
  function circleStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: circleColor(feature.properties.mag),
      color: "#000000",
      radius: circleRadius(feature.properties.mag),
      stroke: true,
      weight: 2
    };
  }
  // create color based on magnitude
  function circleColor(mag) {
    switch (true) {
      case mag > 5:
        return "red";
      case mag > 4:
        return "orange";
      case mag > 3:
        return "yellow";
      case mag > 2:
        return "green";
      case mag > 1:
        return "blue";
      default:
        return "white";
    }
  }

  // create circle radius based on magnitude
  function circleRadius(mag) {
    return mag * 3;
  }
  


  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: circleStyle,

    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

    }
  }).addTo(myMap);


  // creating legend
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = ["white", "blue", "green", "yellow","orange", "red"];


    for (var i = 0; i<grades.length; i++) {
      div.innerHTML +=
      "<i style='background: " + colors[i] + "></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;

  };

  legend.addTo(myMap);
  
});