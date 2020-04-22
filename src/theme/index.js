import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#63ccff',
      main: '#040',
      dark: '#505050',
      contrastText: '#fff',
    },
  },
});

export default theme;
