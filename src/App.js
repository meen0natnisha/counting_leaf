import React from 'react';
import Navigation from './navigations/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.scss';


const theme = createTheme({
  typography: {
    allVariants: {
      color: "#000"
    },
    fontWeightBold: "500",
    fontWeightMedium: "400"
  },
  palette: {
    primary: {
      light: '#E5F5E8',
      main: '#0E7229',
      dark: '#1d1e25',
      contrastText: '#fff',
    },
  },
});

const App = () => {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
    </React.Fragment>
  )
}

export default App;
