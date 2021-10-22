import React, { Fragment } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';

const App: () => JSX.Element = () => {
  return (
    <Fragment>
      <CssBaseline />
      <Layout />
    </Fragment>
  );
};

export default App;
