import React from 'react';
import { uniqueId } from 'lodash';

export default class AddMarkerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  submit = (e) => {
    e.preventDefault();
    const { addMarker, map } = this.props;
    const { value } = this.state;
    addMarker({
      title: value,
      id: uniqueId(),
      position: {
        lat: map.center.lat(),
        lng: map.center.lng(),
      },
      rendered: false,
    });
    this.setState({ value: '' });
  };

  updateMarkerName = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }

  render() {
    const { value } = this.state;
    return (
      <form onSubmit={this.submit}>
        <input type="text" onChange={this.updateMarkerName} value={value} />
        <button type="submit" />
      </form>
    );
  }
}
