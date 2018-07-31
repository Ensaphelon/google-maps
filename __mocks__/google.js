export default {
  LatLng: function(lat, lng) {
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),

      lat: function() { return this.latitude; },
      lng: function() { return this.longitude; }
    };
  },
  LatLngBounds: function(ne, sw) {
    return {
      getSouthWest: function() { return sw; },
      getNorthEast: function() { return ne; }
    };
  },
  OverlayView: function() {
    return {};
  },
  InfoWindow: function(data) {
    return data;
  },
  Marker: function({ title, position}) {
    return {
      title: title,
      position: position,
      setMap: () => {
        return {}
      },
      addListener: () => {
        return {}
      }
    };
  },
  MarkerImage: function() {
    return {};
  },
  Map: function() {
    return {};
  },
  Point: function() {
    return {};
  },
  Size: function() {
    return {};
  },
  Polyline: function() {
    return {
      setMap: () => {
        return {}
      }
    };
  },
  initMap: function() {
    return {
      center: {
        lng: () => 10,
        lat: () => 10,
      }
    }
  }
};