// Store our API endpoint inside queryUrl

// 2.5 magnitude or higher earthquakes in past 7 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Perform a GET request to the query URL

d3.json(queryUrl, function(data) {

  // Upon response, generate geoJSON layer containing the features array 
 
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addpopups,
    pointToLayer : addcircle
  });

 // send layer to the createMap() function.
  createMap(earthquakes);
});

// Defining addpopups and addcircle functions

function addpopups(feature, layer) {

  // Describing location, magnitude and time of the earthquake

  return layer.bindPopup(`<h3> Location: ${feature.properties.place} </h3> <hr> <p> Magnitude: ${feature.properties.mag} </p> <hr> <p> ${Date(feature.properties.time)} </p>`);
}

function addcircle (feature, latlng) {

    var color = "";
  
    if (feature.properties.mag > 4.5){
      color = "dark green";
    }
    else if (feature.properties.mag > 3.5){
      color = "green";
    }
    else if (feature.properties.mag > 2.5){
      color = "lime";
    }
    else {
      color = "white";
    }
  
    return new L.circle(latlng,{
      fillOpacity: 0.45,
      color: color,
      fillColor: color,
      radius: feature.properties.mag * 30000
    })

}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

  // Define satellite and outdoor layers
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold base layers
  var baseMaps = {
    "Satellite_Map": satellite,
    "Outdoors_Map": outdoors
  };

  // Create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [outdoors, earthquakes]
  });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
