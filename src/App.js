import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { initializeDB } from './helpers/init'

import Routes from './routes';

function App() {

  initializeDB();

  return (
    <>
      <CssBaseline />
      <Routes />
    </>
  );
}

export default App;
