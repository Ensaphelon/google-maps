export default class Provider {
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
}
