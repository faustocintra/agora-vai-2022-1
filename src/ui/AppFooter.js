import * as React from 'react'
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { makeStyles } from '@mui/styles';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

const useStyles = makeStyles(theme => ({
    box:{
        position: 'fixed',
        bottom: 0,
        width: '100%'  
    },
    toolbar: {
      backgroundColor: theme.palette.action.selected
    },
    typog: {
      textAlign: 'center',
      width: '100%'
    },
    link: {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {  // Mouse sobre o link
        textDecoration: 'underline'
      }
    }
}));

export default function AppFooter() {
    const classes = useStyles()
    return (
      <Box sx={{ flexGrow: 1 }} className={classes.box}>
        <AppBar position="static" component="footer"> 
          <Toolbar variant="dense" className={classes.toolbar}>
              <Typography variant="caption" className={classes.typog}>
                Desenvolvido com <LocalCafeIcon fontSize="small"/> <a className={classes.link} 
                href="mailto:professor@faustocintra.com.br">Prof. Fausto G. Cintra</a>
              </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }