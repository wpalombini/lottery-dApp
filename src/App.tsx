import { CssBaseline } from '@material-ui/core';
import React, { Fragment } from 'react';
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
