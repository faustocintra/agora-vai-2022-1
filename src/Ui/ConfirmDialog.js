import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmeDialog(title, children, open = false, onClose) {

  const handleClose = answer => {
    //answer === true : resposta positiva a pergunta
    //answer === false : resposta negativa a pergunta
    onClose(answer);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose(false)} //se a pessoa der esc, interpreto que ela não aceitou
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
          <Button onClick={() => handleClose(true)} variant="outlined"> Ok </Button>
          <Button onClick={() => handleClose(false)} autoFocus> Cancelar </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}