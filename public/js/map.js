console.log(L);
const map = L.map('map');

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 15,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets',
}).addTo(map);

// placeholders for the L.marker and L.circle representing user's current position and accuracy
let current_position, current_accuracy;
//Polyline
const rawPoints = [];

function onLocationFound(e) {
  // if position defined, then remove the existing position marker and accuracy circle from the map
  if (current_position) {
    map.removeLayer(current_position);
    map.removeLayer(current_accuracy);
  }

  var radius = e.accuracy / 75;

  current_position = L.marker(e.latlng).addTo(map).bindPopup('You are here ');

  current_accuracy = L.circle(e.latlng, radius).addTo(map);

  console.log('cur pos', e.latlng);

  /*
   const url = 'https://10.114.32.162/node/lisaareitti';

   const reittipiste = JSON.stringify(
       {'latitude': e.latlng.lat, 'longitude': e.latlng.lng});

   const settings = {
     method: 'POST',
     body: reittipiste,
     headers: {
       'Content-type': 'application/json',
     },
   };

   fetch(url, settings).then(function(vastaus) {
     return vastaus.json();
   }).then(function(json) {
     console.log('json', json);
   });
 */
  rawPoints.push({'latitude': e.latlng.lat, 'longitude': e.latlng.lng});

  const coordinates = rawPoints.map(
      rawPoint => new L.LatLng(rawPoint['latitude'], rawPoint['longitude']));

  let polyline = L.polyline(
      coordinates,
      {
        color: 'blue',
        weight: 3,
        opacity: .7,
        lineJoin: 'round',
      },
  );

  L.Routing.control({
    waypoints: [coordinates],
  }).addTo(map);

  polyline.addTo(map);
}

// map.fitBounds(polyline.getBounds());

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

//Send data to database

// Define corridor options including width
var options = {
  corridor: 1000, // meters
  className: 'route-corridor'
};

// Create a corridor and add to the map
var corridor = L.corridor(coords, options);
map.fitBounds(corridor.getBounds());
map.addLayer(corridor);

dataPoints.push(corridor);
