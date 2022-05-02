import * as React from 'react'
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles(theme => ({
    box:{
        position: 'fixed',
        bottom: 0,
        width: '100%'  
    },
    toolbar:{
        background: theme.palette.action.selected 
    },
    Typog:{
        textAlign: 'center',
        width: '100%'
    }
}));


export default function AppFooter() {
    const classes = useStyles()
    return (
      <Box sx={{ flexGrow: 1 }} className={classes.box}>
        <AppBar position="static" component="footer" className='footer'> 
          <Toolbar variant="dense" className={classes.toolbar}>
              <Typography variant="caption" className={classes.Typog}>
                Desenvolvido com café por <a href="mailto:professor@faustocintra.com.br">Prof. Fausto G. Cintra</a>
              </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
  