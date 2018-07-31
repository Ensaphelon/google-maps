import { load, urlSettings } from 'google-maps-promise';
import { polylineSettings } from '../settings';
import Provider from './Provider';

export default class Google extends Provider {
  constructor({ key, options, mapId }) {
    super();
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

  removeMarkerFromMap = (id, markers) => {
    markers
      .filter(marker => marker.id === id)
      .map(marker => marker.setMap(null));
  }
}
