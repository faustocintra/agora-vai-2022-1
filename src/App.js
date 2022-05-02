import './App.css';
import AppHeader from './Ui/AppHeader';
import AppFooter from './Ui/AppFooter';
import { createTheme, ThemeProvider} from '@mui/material';
import { dark } from '@mui/material/styles/createPalette';

const customTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  return (
   <ThemeProvider theme={customTheme}>
   <AppHeader/>
   <AppFooter/>
   </ThemeProvider>
  );
}

export default App;
