import './App.css';
import AppHeader from './ui/AppHeader'
import AppFooter from './ui/AppFooter'
import { createTheme, ThemeProvider } from '@mui/material'
import { blue, amber } from '@mui/material/colors'
import Box from '@mui/material/Box'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AlunoList from './routed/AlunoList'
import AlunoForm from './routed/AlunoForm'

const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[600]
    },
    secondary: {
      main: amber['A400']
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{
        minHeight: '100vh',     // 100% da altura da área de exibição
        marginBottom: '48px',   // Desconta a altura do AppFooter
        backgroundColor: customTheme.palette.background.default,
        color: customTheme.palette.text.primary
      }}>
        <BrowserRouter>
          <AppHeader />

          <Box component="main" sx={{ margin: '24px' }}>
            <Routes>
              <Route path="/aluno" element={<AlunoList />} />
              <Route path="/aluno/novo" element={<AlunoForm />} />
              <Route path="/aluno/:id" element={<AlunoForm />} />
            </Routes>
          </Box>

          <AppFooter />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
