import React from 'react';
import { arrayMove } from 'react-sortable-hoc';
import AddMarkerForm from './AddMarkerForm.jsx';
import MarkersList from './MarkersList.jsx';
import {
  initMap,
  createMarker,
  getPathsFromMarkers,
  createRoute,
} from '../utils';
import settings from '../settings';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      renderedMarkers: [],
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

  updateMarker = (updatedMarkerId, event) => {
    const { markers } = this.state;
    const updatedMarkers = markers.map((marker) => {
      return marker.id !== updatedMarkerId ? marker : {
        title: marker.title,
        id: marker.id,
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      };
    });
    this.setState({
      markers: updatedMarkers,
    });
    this.renderRoute(getPathsFromMarkers(updatedMarkers));
  }

  deleteMarker = (id) => {
    const { markers, renderedMarkers } = this.state;
    const newMarkers = markers.filter(marker => marker.id !== id);
    renderedMarkers.map((marker) => {
      if (marker.id === id) {
        marker.setMap(null);
      }
      return marker;
    });
    this.setState({
      markers: newMarkers,
      renderedMarkers: renderedMarkers.filter(marker => marker.id !== id),
    });
    this.renderRoute(getPathsFromMarkers(newMarkers));
  }

  afterSort = ({ oldIndex, newIndex }) => {
    const { markers } = this.state;
    const sortedMarkers = arrayMove(markers, oldIndex, newIndex);
    this.setState({
      markers: sortedMarkers,
    });
    this.renderRoute(getPathsFromMarkers(sortedMarkers));
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

  renderMarker = (marker, index, mapInstance) => {
    const { updateMarker } = this;
    const { renderedMarkers } = this.state;
    const newMarker = createMarker(marker);
    newMarker.setMap(mapInstance);
    newMarker.id = marker.id;
    newMarker.addListener('dragend', e => updateMarker(newMarker.id, e));
    this.setState({
      renderedMarkers: [...renderedMarkers, newMarker],
    });
  }

  render() {
    const { addMarker, afterSort, deleteMarker } = this;
    const { map, markers } = this.state;
    const { mapId } = settings;
    return (
      <div>
        <MarkersList deleteMarker={deleteMarker} afterSort={afterSort} markers={markers} />
        <AddMarkerForm addMarker={addMarker} map={map} />
        <div id={mapId} />
      </div>
    );
  }
}
