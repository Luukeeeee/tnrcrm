import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const CustomDialog = ({ open, handleAgree, handleDisagree, title, text, agreeText="Agree", disagreeText="Disagree" }) => {
  return (
    <Dialog
      open={open}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAgree} autoFocus>
          {agreeText}
        </Button>
        <Button onClick={handleDisagree}>{disagreeText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
