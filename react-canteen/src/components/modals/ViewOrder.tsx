import React, { FC } from 'react';
import {
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import {
  OrderItem,
  OrderType,
  selectSelectedOrder,
} from '../../redux/slice/orderSlice';
import { getDateTime } from '../../utils/dateTimeConverter';

interface IViewOrder {
  open: boolean;
  handleClose: () => void;
}

const ViewOrder: FC<IViewOrder> = ({ open, handleClose }) => {
  // We will fetch the selected order from OrderSlice.
  const selectedOrder = useSelector(selectSelectedOrder);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle id="delete-confirmation">
        {`View Order - ${selectedOrder.id}`}
      </DialogTitle>
      <ViewOrderContent order={selectedOrder} />
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const ViewOrderContent = ({ order }: { order: OrderType }) => {
  return (
    <DialogContent>
      <Stack direction="row" gap={2} alignItems={'center'}>
        <Typography sx={{ fontWeight: '700' }}>Created By:</Typography>
        <Typography>{order.owner.username}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems={'center'} mb={2}>
        <Typography sx={{ fontWeight: '700' }}>Created On:</Typography>
        <Typography>{getDateTime(order.createdOn)}</Typography>
      </Stack>
      <Typography sx={{ fontWeight: '700' }} variant="h5" mb={1}>
        ITEMS
      </Typography>
      <Stack gap={1}>
        {order.items.map((item: OrderItem, index: number) => (
          <Stack
            direction="row"
            gap={2}
            alignItems={'center'}
            key={`${item.id}-${index}`}
          >
            <SmallPicture src={item.photoURL} alt={item.name} />
            <Typography>{item.name}</Typography>
            <Typography>{item.price}</Typography>
          </Stack>
        ))}
      </Stack>
    </DialogContent>
  );
};

export const SmallPicture = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: 'block',
        width: '70px',
        height: '70px',
        objectFit: 'cover',
      }}
    />
  );
};

export default ViewOrder;
