import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import logo from '../Assets/agora-vai-logo.png';
import MainMenu from './MainMenu'

export default function AppHeader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
        
          <MainMenu/>
          {/* <Typography variant="h6" color="inherit" component="div">
            Photos
          </Typography> */}
          <a href='#'>
            <img style={{height: '50px'}} src={logo} alt='Logotipo da Escola de Idioma Agora Vai'/>
          </a>
        </Toolbar>
      </AppBar>
    </Box>
  );
}