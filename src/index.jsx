import React from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/App.jsx';
import { mapSettings } from './settings';
import Google from './providers/Google';

const provider = new Google(mapSettings);

provider.loadApi().then((api) => {
  provider.api = api;
  render(
    <App provider={provider} />,
    document.getElementById('entry'),
  );
});
