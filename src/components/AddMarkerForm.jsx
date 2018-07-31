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
    const { addMarker, map: { center: { lat, lng } } } = this.props;
    const { value } = this.state;
    if (value) {
      addMarker({
        title: value,
        id: uniqueId(),
        position: {
          lat: lat(),
          lng: lng(),
        },
        rendered: false,
      });
      this.setState({ value: '' });
    }
  };

  updateMarkerName = (e) => {
    const { value } = e.target;
    this.setState({
      value,
      isValid: value.length > 0,
    });
  }

  render() {
    const { value, isValid } = this.state;
    const inputClass = cn({
      'form-control': true,
      'is-invalid': !isValid,
    });
    return (
      <form data-role="new-marker-form" className="form-inline mb-2 mt-3" onSubmit={this.submit}>
        <div className="form-group">
          <input data-role="new-marker-field" required className={inputClass} type="text" onChange={this.updateMarkerName} value={value} />
        </div>
        <button data-role="new-marker-submit-button" className="btn btn-xm btn-primary btn-add-marker" type="submit">
          <span>Add marker</span>
        </button>
      </form>
    );
  }
}
