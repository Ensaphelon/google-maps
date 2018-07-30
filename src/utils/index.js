import googleMaps from 'google-maps';
import { mapSettings, polylineSettings } from '../settings';

let api = null;

export const initMap = (callback) => {
  const { mapId, key, options } = mapSettings;
  googleMaps.KEY = key;
  googleMaps.load((google) => {
    api = google.maps;
    const map = new api.Map(
      document.getElementById(mapId),
      options,
    );
    callback(map);
  });
};

export const createMarker = (marker) => {
  const { position, title } = marker;
  return new api.Marker({
    position,
    title,
    draggable: true,
  });
};

export const createInfoWindow = (title) => {
  return new api.InfoWindow({
    content: title,
  });
};

export const createRoute = (paths) => {
  return new api.Polyline({
    path: paths,
    ...polylineSettings,
  });
};

export const getPathsFromMarkers = (markers) => {
  return markers.reduce((acc, { position: { lat, lng } }) => {
    return [...acc, { lat, lng }];
  }, []);
};

export const getNewMarkerPosition = (event) => {
  const { latLng: { lat, lng } } = event;
  return {
    lat: lat(),
    lng: lng(),
  };
};

export const updateMarkersAfterMove = (markers, id, position) => {
  return markers.map((marker) => {
    return marker.id !== id ? marker : {
      title: marker.title,
      id: marker.id,
      position,
    };
  });
};

export const removeMarkerFromMap = (id, markers) => {
  markers.map((marker) => {
    if (marker.id === id) {
      marker.setMap(null);
    }
    return marker;
  });
};
