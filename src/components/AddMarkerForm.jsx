import React from 'react';
import cn from 'class-names';
import { uniqueId } from 'lodash';

export default class AddMarkerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isValid: true,
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
    this.setState({
      value,
      isValid: value.length > 0
    });
  }

  render() {
    const { value } = this.state;
    const inputClass = cn({
      'form-control': true,
      'is-invalid': !this.state.isValid,
    })
    return (
      <form className="form-inline mb-2 mt-3" onSubmit={this.submit}>
        <div className="form-group">
          <input required className={inputClass} type="text" onChange={this.updateMarkerName} value={value} />
        </div>
        <button className="btn btn-xm btn-primary" type="submit">
          <span>Add marker</span>
        </button>
      </form>
    );
  }
}
