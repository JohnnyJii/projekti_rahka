var map = L.map('map');

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);

// placeholders for the L.marker and L.circle representing user's current position and accuracy
var current_position, current_accuracy;

function onLocationFound(e) {
  // if position defined, then remove the existing position marker and accuracy circle from the map
  if (current_position) {
    map.removeLayer(current_position);
    map.removeLayer(current_accuracy);
  }

  var radius = e.accuracy / 75;

  current_position = L.marker(e.latlng).addTo(map)
  .bindPopup("You are here " + radius).openPopup();

  current_accuracy = L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// wrap map.locate in a function
function locate() {
  map.locate({setView: true, maxZoom: 15});
}

// interval
setInterval(locate, 2000);