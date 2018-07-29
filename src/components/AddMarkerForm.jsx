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
      <form className="form-inline mb-2 mt-3" onSubmit={this.submit}>
        <div className="form-group">
          <input className="form-control" type="text" onChange={this.updateMarkerName} value={value} />
        </div>
        <button className="btn btn-xm btn-primary" type="submit">
          <span>Add marker</span>
        </button>
      </form>
    );
  }
}
