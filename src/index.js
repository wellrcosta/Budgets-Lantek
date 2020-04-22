import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Theme from './theme';

ReactDOM.render(
  <MuiThemeProvider theme={Theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MuiThemeProvider>,
  document.getElementById('root')
);
