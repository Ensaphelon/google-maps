import React from 'react';
import { arrayMove } from 'react-sortable-hoc';
import AddMarkerForm from './AddMarkerForm.jsx';
import MarkersList from './MarkersList.jsx';
import {
  initMap,
  createMarker,
  getPathsFromMarkers,
  createRoute,
  getNewMarkerPosition,
  updateMarkersAfterMove,
  removeMarkerFromMap,
  createInfoWindow,
} from '../utils';
import { mapSettings } from '../settings';

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

  addMarker = (marker) => {
    const { renderMarker, renderRoute } = this;
    const { markers, map } = this.state;
    const newMarkers = [...markers, marker];
    this.setState({
      markers: newMarkers,
    });
    renderMarker(marker, map);
    renderRoute(getPathsFromMarkers(newMarkers));
  }

  storeMapInComponent = (map) => {
    this.setState({ map });
  }

  moveMarker = (id, event) => {
    const { markers } = this.state;
    const position = getNewMarkerPosition(event);
    const updatedMarkers = updateMarkersAfterMove(markers, id, position);
    this.setState({ markers: updatedMarkers });
    this.renderRoute(getPathsFromMarkers(updatedMarkers));
  }

  deleteMarker = (id) => {
    const { markers, renderedMarkers } = this.state;
    const newMarkers = markers.filter(marker => marker.id !== id);
    removeMarkerFromMap(id, renderedMarkers);
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

  renderMarker = (marker, mapInstance) => {
    const { moveMarker } = this;
    const { renderedMarkers, map } = this.state;
    const { id } = marker;
    const newMarker = createMarker(marker);
    const infoWindow = createInfoWindow(marker.title);
    newMarker.setMap(mapInstance);
    newMarker.id = id;
    newMarker.addListener('dragend', e => moveMarker(id, e));
    newMarker.addListener('click', () => infoWindow.open(map, newMarker));
    this.setState({
      renderedMarkers: [...renderedMarkers, newMarker],
    });
  }

  render() {
    const { addMarker, afterSort, deleteMarker } = this;
    const { map, markers } = this.state;
    const { mapId } = mapSettings;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-4">
            <AddMarkerForm addMarker={addMarker} map={map} />
            <MarkersList deleteMarker={deleteMarker} afterSort={afterSort} markers={markers} />
          </div>
          <div className="col-xs-12 col-sm-8">
            <div id={mapId} />
          </div>
        </div>
      </div>
    );
  }
}
