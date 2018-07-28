import googleMaps from 'google-maps';
import settings from '../settings';

let api = null;

export const initMap = (callback) => {
  const { id, key, options } = settings;
  googleMaps.KEY = key;
  googleMaps.load((google) => {
    api = google.maps;
    const map = new api.Map(
      document.getElementById(id),
      options,
    );
    callback(map);
  });
};

export const createMarker = (marker) => {
  const { position, title } = marker;
  return new api.Marker({ position, title, draggable: true });
};

export const createRoute = (paths) => {
  return new api.Polyline({
    path: paths,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });
};

export const getPathsFromMarkers = (markers) => {
  return markers.reduce((acc, { position: { lat, lng } }) => {
    return [...acc, { lat, lng }];
  }, []);
};
