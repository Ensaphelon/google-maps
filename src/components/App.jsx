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

  addMarker = (marker) => {
    const { provider } = this.props;
    const { renderMarker, renderRoute } = this;
    const { markers, map } = this.state;
    const newMarkers = [...markers, marker];
    this.setState({
      markers: newMarkers,
    });
    renderMarker(marker, map);
    renderRoute(provider.getPathsFromMarkers(newMarkers));
  }

  storeMapInComponent = (map) => {
    this.setState({ map });
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
    const { provider } = this.props;
    const { moveMarker } = this;
    const { renderedMarkers, map } = this.state;
    const { id } = marker;
    const newMarker = provider.createMarker(marker);
    const infoWindow = provider.createInfoWindow(marker.title);
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
