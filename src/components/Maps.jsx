import React from 'react';
import { initMap } from '../utils';
import { maps as settings } from '../settings';

const { id, options } = settings;

class Maps extends React.Component {
    render(){
        return (
            <div id={id} />
        )
    }
    componentDidMount(){
        initMap(id, options)
    }
}

export default Maps;