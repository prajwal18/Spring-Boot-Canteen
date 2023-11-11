import React, { FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { RedBtn } from '../styled-components/Button';
import { useNavigate } from 'react-router-dom';

interface ILoginOrContinueBrowsing {
  open: boolean;
  handleClose: () => void;
}

const LoginOrContinueBrowsing: FC<ILoginOrContinueBrowsing> = ({
  open,
  handleClose,
}) => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="login-or-continue-browsing">
        Login to make an order.
      </DialogTitle>
      <DialogContent>
        <Typography>You need to be logged in to make an order.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogin} variant="outlined">
          Login
        </Button>
        <RedBtn onClick={handleClose} variant="outlined">
          Continue Browsing
        </RedBtn>
      </DialogActions>
    </Dialog>
  );
};

export default LoginOrContinueBrowsing;
