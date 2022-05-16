import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmDialog({title, children, open = false, onClose}) {

  const handleClose = answer => {
      // answer === true: resposta positiva à pergunta
      // answer === false: reposta nagativa à pergunta
    onClose(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(true)} variant="outlined">Ok</Button>
          <Button onClick={() => handleClose(false)} autoFocus>Cancelar</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}
