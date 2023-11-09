import React, { FC } from 'react';
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getDateTime } from '../../utils/dateTimeConverter';
import { ItemType, selectSelectedItem } from '../../redux/slice/itemSlice';

interface IViewItem {
  open: boolean;
  handleClose: () => void;
}

const ViewItem: FC<IViewItem> = ({ open, handleClose }) => {
  // We will fetch the selected item from ItemSlice.
  const item = useSelector(selectSelectedItem);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle id="view-item">{`View Item - ${item.name}`}</DialogTitle>
      <ViewItemContent item={item} />
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const ViewItemContent = ({ item }: { item: ItemType }) => {
  return (
    <DialogContent>
      <Stack direction="row" gap={2}>
        {/* Info section */}
        <Box sx={{ flexGrow: '1' }}>
          <Stack direction="row" gap={2} alignItems={'center'} mb={1}>
            <Typography sx={{ fontWeight: '700' }}>Name:</Typography>
            <Typography>{item.name}</Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems={'center'} mb={1}>
            <Typography sx={{ fontWeight: '700' }}>Price:</Typography>
            <Typography>{item.price}</Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems={'center'} mb={2}>
            <Typography sx={{ fontWeight: '700' }}>Category:</Typography>
            <Typography>{item.category.name}</Typography>
          </Stack>
          <Box mb={2}>
            <Typography sx={{ fontWeight: '700' }}>
              DESCRIPTION
            </Typography>
            <Typography>{item.description}</Typography>
          </Box>
          <Stack direction="row" gap={2} alignItems={'center'} mb={1}>
            <Typography sx={{ fontWeight: '700' }}>Created On:</Typography>
            <Typography>{getDateTime(item.createdOn)}</Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems={'center'} mb={1}>
            <Typography sx={{ fontWeight: '700' }}>Update On:</Typography>
            <Typography>{getDateTime(item.updatedOn)}</Typography>
          </Stack>
        </Box>
        {/* Info section */}

        {/* Picture section */}
        <Box sx={{ flexGrow: '1', p: 2 }}>
          <img
            src={item.photoURL}
            alt={item.name}
            style={{
              display: 'block',
              width: '100%',
              maxWidth:"400px",
              height: '100%',
              objectFit: 'cover',
            }}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = process.env.REACT_APP_IMAGE_NOT_FOUND || '';
            }}
          />
        </Box>
        {/* Picture section */}
      </Stack>
    </DialogContent>
  );
};

export default ViewItem;
