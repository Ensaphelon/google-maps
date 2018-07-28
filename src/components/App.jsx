import React from 'react';
import Maps from './Maps.jsx';
import AddMarkerForm from './AddMarkerForm.jsx';
import { initMap, createMarker, getPathsFromMarkers, createRoute } from '../utils';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      route: null,
      map: null,
    };
  }

  componentDidMount = () => {
    initMap(this.storeMapInComponent);
  }

  storeMapInComponent = (map) => {
    this.setState({ map });
  }

  addMarker = (marker) => {
    const { markers, map } = this.state;
    const { renderMarker } = this;
    const newMarkers = [...markers, marker];
    this.setState({
      markers: newMarkers,
    });
    renderMarker(marker, markers.length, map);
    this.renderRoute(getPathsFromMarkers(newMarkers));
  }

  updateMarker = (updatedMarkerIndex, event) => {
    const { markers } = this.state;
    this.setState({
      markers: markers.map((marker, index) => {
        return index !== updatedMarkerIndex ? marker : {
          title: marker.title,
          position: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          },
        };
      }),
    });
    this.renderRoute(getPathsFromMarkers(this.state.markers));
  }

  renderMarker = (marker, index, mapInstance) => {
    const { updateMarker } = this;
    const newMarker = createMarker(marker);
    newMarker.setMap(mapInstance);
    newMarker.addListener('dragend', updateMarker.bind({}, index));
  }

  renderRoute = (path) => {
    const { map, route } = this.state;
    if (route) {
      route.setMap(null);
    }
    const newRoute = createRoute(path);
    newRoute.setMap(map);
    this.setState({
      route: newRoute,
    });
  }

  render() {
    const { addMarker } = this;
    const { map } = this.state;
    return (
      <div>
        <AddMarkerForm addMarker={addMarker} map={map} />
        <Maps />
      </div>
    );
  }
}
