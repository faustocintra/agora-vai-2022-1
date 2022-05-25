import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles';
// import { width } from '@mui/system';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

const useStyles = makeStyles (theme => ({
    box: {
    position: 'fixed',
    bottom: 0,
    width: '100%'
  },
  toolbar:{
    backgroundColor: theme.palette.action.selected
  },
  typog: {
    textAlign: 'center',
    width:'100%'
  }, 
  link:{
    color: theme.palette.secondary.main,
    textDecoration:'none',
    '&:houver':{//Mouse sobre o link
      TextDecoration: 'underline'
    }
  }
})) 

export default function AppFooter() {

  const classes = useStyles()

  return (
    <Box sx={{ flexGrow: 1 }} className={classes.box}>
      <AppBar position="static" component={'footer'}>
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography variant="caption" className={classes.typog}>
            Desenvolvido com <LocalCafeIcon fontSize="small"/>  por <a className={classes.link} href='feliphefaleiros@hotmail.com'> Feliphe</a>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}