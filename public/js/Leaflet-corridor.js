L.Corridor = L.Polyline.extend({
  initialize: function (latlngs, options) {
    var self = this;

    L.Polyline.prototype.initialize.call(this, latlngs, options);

    this.corridor = options.corridor;
    this.updateCallback = (function (e) {
      self._updateWeight(this);
    });
  },

  onAdd: function(map) {
    L.Polyline.prototype.onAdd.call(this, map);
    map.on('zoomend', this.updateCallback);
    this._updateWeight(map);
  },

  onRemove: function(map) {
    map.off('zoomend', this.updateCallback);
    L.Polyline.prototype.onRemove.call(this, map);
  },

  _updateWeight: function(map) {
    this.setStyle({ 'weight': this._getWeight(map, this.corridor) });
  },

  _getWeight: function (map, corridor) {
    return corridor * 2 / this._getMetersPerPixel(map);
  },

  _getMetersPerPixel: function(map) {
    var centerLatLng = map.getCenter(); // get map center
    var pointC = map.latLngToContainerPoint(centerLatLng); // convert to containerpoint (pixels)
    var pointX = L.point(pointC.x + 10, pointC.y); // add 10 pixels to x

    // convert containerpoints to latlng's
    var latLngX = map.containerPointToLatLng(pointX);
    return centerLatLng.distanceTo(latLngX) / 10; // calculate distance between c and x (latitude)
  }
});

L.corridor = function (latlngs, options) {
  return new L.Corridor(latlngs, options || { corridor: 100 });
}