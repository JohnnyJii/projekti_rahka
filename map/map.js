'use strict'

var map = new L.Map('map', {
  zoom: 12,
  center: new L.latLng([41.575730,13.002411])
});

map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));	//base layer

var gps = new L.Control.Gps({
  //autoActive:true,
  autoCenter:true
});//inizialize control

gps
.on('gps:located', function(e) {
  //	e.marker.bindPopup(e.latlng.toString()).openPopup()
  console.log(e.latlng)
})
.on('gps:disabled', function(e) {
  e.marker.closePopup()
});

gps.addTo(map);