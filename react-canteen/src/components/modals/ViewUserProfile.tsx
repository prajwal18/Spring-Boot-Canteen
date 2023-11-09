import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSelectedUser } from '../../redux/slice/userSlice';
import { ViewUserContent } from './ViewUser';

interface IViewUserProfile {
  open: boolean;
  handleClose: () => void;
}

const ViewUserProfile: FC<IViewUserProfile> = ({ open, handleClose }) => {
  const user = useSelector(selectSelectedUser);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle id="view-user">{`View User - ${user.username}`}</DialogTitle>
      <ViewUserContent user={user} />
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserProfile;
