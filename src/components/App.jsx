import React from 'react';
import { arrayMove } from 'react-sortable-hoc';
import AddMarkerForm from './AddMarkerForm.jsx';
import MarkersList from './MarkersList.jsx';
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
    const { provider } = this.props;
    this.setState({ map: provider.initMap() });
  }

  addMarker = (markerData) => {
    const { renderMarker, renderRoute, bindMarkerEvents } = this;
    const { provider } = this.props;
    const { markers, map } = this.state;
    const { id } = markerData;
    const newMarkers = [...markers, markerData];
    const marker = provider.createMarker(markerData);
    const infoWindow = provider.createInfoWindow(markerData.title);
    marker.id = id;
    bindMarkerEvents(marker, infoWindow, map);
    renderMarker(marker, map);
    renderRoute(provider.getPathsFromMarkers(newMarkers));
    this.setState({
      markers: newMarkers,
    });
  }

  bindMarkerEvents = (marker, infoWindow, map) => {
    const { moveMarker } = this;
    marker.addListener('dragend', e => moveMarker(marker.id, e));
    marker.addListener('click', () => infoWindow.open(map, marker));
  }

  moveMarker = (id, event) => {
    const { provider } = this.props;
    const { markers } = this.state;
    const position = provider.getNewMarkerPosition(event);
    const updatedMarkers = provider.updateMarkersAfterMove(markers, id, position);
    this.setState({ markers: updatedMarkers });
    this.renderRoute(provider.getPathsFromMarkers(updatedMarkers));
  }

  deleteMarker = (id) => {
    const { provider } = this.props;
    const { markers, renderedMarkers } = this.state;
    const newMarkers = markers.filter(marker => marker.id !== id);
    provider.removeMarkerFromMap(id, renderedMarkers);
    this.setState({
      markers: newMarkers,
      renderedMarkers: renderedMarkers.filter(marker => marker.id !== id),
    });
    this.renderRoute(provider.getPathsFromMarkers(newMarkers));
  }

  afterSort = ({ oldIndex, newIndex }) => {
    const { provider } = this.props;
    const { markers } = this.state;
    const sortedMarkers = arrayMove(markers, oldIndex, newIndex);
    this.setState({
      markers: sortedMarkers,
    });
    this.renderRoute(provider.getPathsFromMarkers(sortedMarkers));
  }

  renderRoute = (path) => {
    const { provider } = this.props;
    const { map, route } = this.state;
    if (route) {
      route.setMap(null);
    }
    const newRoute = provider.createRoute(path);
    newRoute.setMap(map);
    this.setState({
      route: newRoute,
    });
  }

  renderMarker = (marker, mapInstance) => {
    const { renderedMarkers } = this.state;
    marker.setMap(mapInstance);
    this.setState({
      renderedMarkers: [...renderedMarkers, marker],
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
