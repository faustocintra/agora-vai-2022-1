import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import logo from '../Assets/agora-vai-logo.png'
import MainMenu from './MainMenu'
import Typography from '@mui/material/Typography'
import {makeStyles} from '@mui/styles'
import { width } from '@mui/system';

const useStyles = makeStyles(theme => ({
  box: {
    position: 'fixed',
    bottom: 0,
    width: '100%'
  },
  toolbar:{
    backgroundColor: theme.palette.background.hover
  },
  typog:{
    textAlign: 'center',
    width: '100%'
  }
}))

export default function AppFooter() {
  const classes = useStyles();
  return (
    <Box sx={{ flexGrow: 1 }} className={classes.box}>
      <AppBar position="static" componente="footer">
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography variant='caption' className={classes.typog}>
            Desenvolvido com café por <a href='mailto:fernandoasfilho74@gmail.com'>
              Fernando Almeida da Siva Filho
            </a>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
