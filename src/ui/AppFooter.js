import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme=>({
  box:{
    position: "fixed",
    bottom: 0,
    width:"100%"
  },
  toolbar:{
    backgroundColor: theme.palette.action.selected
  },
  typog:{
    textAlign: "center",
    width: "100%"
  }

}))

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Box sx={{ flexGrow: 1 }} className={classes.box}>
      <AppBar position="static" component="footer">
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography className={classes.typog} variant="caption">
              Desenvolvido com café por <a href='https://github.com/GabrielJesusS'>Gabriel Jesus</a>
          </Typography >
        </Toolbar>
      </AppBar>
    </Box>
  );
}
