import React from 'react';
import settings from '../settings';

class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedMarkers: [],
    };
  }

  render() {
    const { id } = settings;
    return <div id={id} />;
  }
}

export default Maps;
