import React, { FC, useMemo } from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreateOrderItem,
  createOrder,
  removeItemFromCart,
  selectMakeOrderIsSubmitting,
  selectOrder,
} from '../../redux/slice/makeOrderSlice';
import { SmallPicture } from '../../components/modals/ViewOrder';
import { RedBtn } from '../../components/styled-components/Button';

// ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import { AppDispatch } from '../../redux/store';
// ICONS

interface ICartComponent {
  handleClose: () => void;
}
const CartComponent: FC<ICartComponent> = ({ handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSubmitting = useSelector(selectMakeOrderIsSubmitting);
  const order = useSelector(selectOrder);
  const orderTotal = useMemo(() => {
    if (order) {
      let total = 0;
      order.items.forEach((item: any) => {
        total += item.price;
      });
      return total;
    }
    return 0.0;
  }, [order]);

  const handleRemoveItemFromCart = (id: number) => {
    dispatch(removeItemFromCart(id));
  };

  const handleCheckout = () => {
    dispatch(createOrder({}));
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '0px',
        right: '0px',
        height: '100vh',
        width: '400px',
        padding: '10px 20px 20px 30px',
        background: '#f5f5f5',
        boxShadow: '0px 0 20px -5px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Box
          aria-label="close cart sidebar"
          sx={{
            color: 'grey',
            fontSize: '20px',
            cursor: 'pointer',
            p: '5px 10px',
            '&:hover': { background: 'rgba(0,0,0,0.1)' },
          }}
          onClick={handleClose}
        >
          X
        </Box>
      </Stack>

      <Typography variant="h5" mb={4}>
        Your Order
      </Typography>

      <ItemList removeItemFromCart={handleRemoveItemFromCart} order={order} />
      <Stack direction="row" justifyContent="space-between" gap={4} mb={4}>
        <Typography sx={{ fontWeight: '700' }}>Total:</Typography>
        <Typography>{orderTotal}</Typography>
      </Stack>
      <RedBtn
        variant="outlined"
        sx={{ width: '100%' }}
        disabled={isSubmitting}
        onClick={handleCheckout}
      >
        CHECKOUT
      </RedBtn>
    </Box>
  );
};

interface IItemList {
  removeItemFromCart: (id: number) => void;
  order: { items: Array<CreateOrderItem> } | null;
}
const ItemList: FC<IItemList> = ({ removeItemFromCart, order }) => {
  return (
    <Stack spacing={2} mb={2}>
      <Stack spacing={2} mb={2}>
        {order ? (
          order.items.map((item: CreateOrderItem, index: number) => (
            <Stack
              direction="row"
              gap={2}
              alignItems={'center'}
              key={`${item.id}-${index}`}
            >
              <SmallPicture src={item.photoURL} alt={item.name} />
              <Typography>{item.name}</Typography>
              <Typography>{item.price}</Typography>
              <RedBtn onClick={() => removeItemFromCart(item.id)}>
                <DeleteIcon />
              </RedBtn>
            </Stack>
          ))
        ) : (
          <Typography sx={{ color: 'grey' }}>No items...</Typography>
        )}
      </Stack>
      <Divider />
    </Stack>
  );
};

export default CartComponent;
