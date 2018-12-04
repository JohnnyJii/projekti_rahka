var map = L.map('map');

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets',
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

  current_position = L.marker(e.latlng).addTo(map).bindPopup('You are here ');

  current_accuracy = L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// wrap map.locate in a function
function locate() {
  map.locate({setView: true, maxZoom: 20});
}

// interval
setInterval(locate, 2000);

//Waypoints

//Polyline
var start = new L.LatLng(onLocationFound(e));
var midway = [];
for (int i = 0, i < 720, i++)
midway.add(onLocationFound()
);
var finish = new L.LatLng(onLocationFound(e));
var pointList = [start, midway, finish];

var firstpolyline = new L.Polyline(pointList, {
  color: 'red',
  weight: 3,
  opacity: 0.5,
  smoothFactor: 1,
});
firstpolyline.addTo(map);

//Route km
