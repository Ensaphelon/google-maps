import { times, uniq, isEqual } from 'lodash';
import Google from '../src/providers/Google';
import { mapSettings } from '../src/settings';
import mockedApi from '../__mocks__/google.js';

const generateMarker = (title) => {
  return {
    title,
    id: uniq(),
    position: {
      lat: Math.random(10),
      lng: Math.random(10),
    },
  };
};

describe('Google provider', () => {
  const provider = new Google(mapSettings);
  provider.api = mockedApi;
  it('creates marker', () => {
    const markerData = generateMarker('New Marker');
    const marker = provider.createMarker(markerData);
    expect(marker.title).toEqual('New Marker');
  });
  it('creates info window', () => {
    const title = 'New Window';
    const infoWindow = provider.createInfoWindow(title);
    expect(infoWindow).toEqual({
      content: 'New Window',
    });
  });
  it('return corrects array of paths from markers', () => {
    const markers = times(5, () => generateMarker('New Marker'));
    const paths = provider.getPathsFromMarkers(markers);
    const hits = paths.reduce((acc, path, index) => {
      return isEqual(path, markers[index].position) ? acc + 1 : acc;
    }, 0);
    expect(hits).toEqual(5);
  });
  it('updates markers list after moving one of them', () => {
    const markers = times(5, () => generateMarker('New Marker'));
    const someId = markers[2].id;
    const newPosition = {
      lat: 10,
      lng: 10,
    };
    const updatedMarkers = provider.updateMarkersAfterMove(markers, someId, newPosition);
    const oldPaths = provider.getPathsFromMarkers(markers);
    const newPaths = provider.getPathsFromMarkers(updatedMarkers);
    const hits = oldPaths.reduce((acc, path, index) => {
      return isEqual(path, newPaths[index]) ? acc + 1 : acc;
    }, 0);
    expect(hits).toEqual(4);
  });
});
