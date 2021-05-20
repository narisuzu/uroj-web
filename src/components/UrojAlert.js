import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function UrojAlert(props) {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.onClose();
  };

  return (
    <div className={classes.root}>
      <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.severity} action={props.action} elevation={6} variant="filled">
          {props.info}
        </Alert>
      </Snackbar>
    </div>
  );
}
