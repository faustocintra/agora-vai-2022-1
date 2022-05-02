import './App.css';
import AppHeader from './UI/AppHeader'
import AppFooter from './UI/AppFooter';
import {createTheme, ThemeProvider} from '@mui/material'


const customTheme = createTheme({
    palette:{
        mode: 'dark'
    }
})

function App() {
  return (
    <>
    <ThemeProvider theme={customTheme}>
      <AppHeader />
      <AppFooter />
    </ThemeProvider>
    </>
  );
}

export default App;
