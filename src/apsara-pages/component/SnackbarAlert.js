import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarAlert = ({ open, onClose, message, severity, duration = 3000, position = { vertical: 'top', horizontal: 'right' } }) => {
  return (
    <Snackbar
      anchorOrigin={position}
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
