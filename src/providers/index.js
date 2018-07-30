import { load, urlSettings } from 'google-maps-promise';
import { polylineSettings } from '../settings';

export default class Google {
  constructor({ key, options, mapId }) {
    this.key = key;
    this.options = options;
    this.mapId = mapId;
  }

  loadApi() {
    const { key } = this;
    urlSettings.key = key;
    return load();
  }

  initMap() {
    return new this.api.Map(
      document.getElementById(this.mapId),
      this.options,
    );
  }

  createMarker(marker) {
    const { position, title } = marker;
    return new this.api.Marker({
      position,
      title,
      draggable: true,
    });
  }

  createInfoWindow(title) {
    return new this.api.InfoWindow({
      content: title,
    });
  }

  createRoute(paths) {
    return new this.api.Polyline({
      path: paths,
      ...polylineSettings,
    });
  }

  getNewMarkerPosition = (event) => {
    const { latLng: { lat, lng } } = event;
    return {
      lat: lat(),
      lng: lng(),
    };
  }

  getPathsFromMarkers = (markers) => {
    return markers.reduce((acc, { position: { lat, lng } }) => {
      return [...acc, { lat, lng }];
    }, []);
  }

  updateMarkersAfterMove = (markers, id, position) => {
    return markers.map((marker) => {
      return marker.id !== id ? marker : {
        title: marker.title,
        id: marker.id,
        position,
      };
    });
  }

  removeMarkerFromMap = (id, markers) => {
    markers.map((marker) => {
      if (marker.id === id) {
        marker.setMap(null);
      }
      return marker;
    });
  }
}
