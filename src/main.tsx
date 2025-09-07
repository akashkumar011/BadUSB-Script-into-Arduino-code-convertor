import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './ui/App';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00d3a7' },
    secondary: { main: '#8be9fd' }
  },
  shape: { borderRadius: 12 }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);


