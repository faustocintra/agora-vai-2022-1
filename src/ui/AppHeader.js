import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import logo from '../assets/agora-vai-logo.png'
import MainMenu from './MainMenu'

export default function AppHeader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <MainMenu />
          <a href="#">
              <img style={{ height: '75px' }} src={logo} alt="Logotipo da Escola de Idiomas Agora Vai" /> 
          </a>
        </Toolbar>
      </AppBar>
    </Box>
  );
};