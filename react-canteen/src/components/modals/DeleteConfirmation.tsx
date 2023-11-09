import React, { FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface IDeleteConfirmation {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  entity: string;
  warning?: string;
}

const DeleteConfirmation: FC<IDeleteConfirmation> = ({
  open,
  handleClose,
  handleDelete,
  entity,
  warning,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="delete-confirmation">
        {`Are you sure you want to delete the ${entity}.`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-confirmation-description">
          {warning || (
            <>
              By confirmining the delete, you will permanently delete the{' '}
              {entity}.
            </>
          )}
          Press
          <span style={{ fontWeight: '700' }}> Delete </span> to proceed.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} autoFocus sx={{ color: 'red' }}>
          Delete
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
