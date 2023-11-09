import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Stack,
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  OrderItem,
  OrderType,
  editOrder,
  selectSelectedOrder,
  setSelectedOrder,
} from '../../redux/slice/orderSlice';
import { getDateTime } from '../../utils/dateTimeConverter';
import { AppDispatch } from '../../redux/store';
import {
  fetchCategoriesDD,
  selectCategoriesDD,
} from '../../redux/slice/categorySlice';
import { fetchUserDD, selectUserDD } from '../../redux/slice/userSlice';
import { fetchItemDD, selectItemDD } from '../../redux/slice/itemSlice';
import { useFormik } from 'formik';
import { AddEditOrderType } from '../../query/fn.order';
import { addEditOrderSchema } from '../../utils/YupSchema';
import { SmallPicture } from './ViewOrder';
import { RedBtn } from '../styled-components/Button';

//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
//ICONS
import CustomSelect from '../form/CustomSelect';
import { toast } from 'react-toastify';

interface IEditOrder {
  open: boolean;
  handleClose: () => void;
}
interface IEditOrderSubComponents {
  order: OrderType;
  dispatch: any;
  formik: any;
}

// Main Component ( Container Component )
const EditOrder: FC<IEditOrder> = ({ open, handleClose }) => {
  const order = useSelector(selectSelectedOrder);
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: { owner: null, items: [] },
    validationSchema: addEditOrderSchema,
    enableReinitialize: true,
    onSubmit: async (values: AddEditOrderType) => {
      // Do something
      await dispatch(editOrder(values));
      formik.resetForm();
      handleClose();
    },
  });

  // Fetching categoryDD
  useEffect(() => {
    dispatch(fetchCategoriesDD());
  }, [dispatch]);

  useEffect(() => {
    if (order?.id) {
      let itemIds = order.items.map((item: OrderItem) => item.id);
      formik.setFieldValue('owner', order.owner.id);
      formik.setFieldValue('items', itemIds);
    }
  }, [order]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle id="Edit-Order">{`Edit Order - ${order?.id}`}</DialogTitle>
      {order?.id && (
        <EditOrderContent order={order} dispatch={dispatch} formik={formik} />
      )}
    </Dialog>
  );
};

// Form Content Component
const EditOrderContent: FC<IEditOrderSubComponents> = ({
  order,
  dispatch,
  formik,
}) => {
  return (
    <DialogContent>
      <Stack
        spacing={4}
        p={2}
        sx={{ width: '100%' }}
        component={'form'}
        onSubmit={formik.handleSubmit}
      >
        <SelectOwner order={order} dispatch={dispatch} formik={formik} />
        <SelectItem order={order} dispatch={dispatch} formik={formik} />
        <ListItems order={order} dispatch={dispatch} formik={formik} />
        <Button
          sx={{ width: '100%', display: 'block' }}
          variant="outlined"
          type="submit"
        >
          Submit
        </Button>
      </Stack>
    </DialogContent>
  );
};

// Select Owner
const SelectOwner: FC<IEditOrderSubComponents> = ({ order, dispatch }) => {
  const [change, setChange] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const userDD = useSelector(selectUserDD);

  const handleSelectUser = (user: any) => {
    let newOwner = {
      ...order.owner,
      id: user.id,
      username: user.username,
      email: user.email,
    }; // Only replacing necessary fields. Other field don't really mater in this case.
    let newOrder = JSON.parse(JSON.stringify(order));
    newOrder.owner = newOwner;
    dispatch(setSelectedOrder(newOrder));
    setChange(false);
  };

  useEffect(() => {
    if (order?.id) {
      setSearchTerm(order.owner.username);
    }
  }, [order]);

  useEffect(() => {
    dispatch(fetchUserDD(searchTerm));
  }, [searchTerm, dispatch]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{ fontWeight: '700' }} variant="h5" mb={1}>
        OWNER
      </Typography>
      <Stack direction="row" gap={2}>
        <TextField
          label="Owner"
          value={searchTerm}
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <RedBtn
          variant="outlined"
          onClick={() => {
            setChange(true);
          }}
        >
          {change ? <DoneIcon /> : <EditIcon />}
        </RedBtn>
      </Stack>
      {change && (
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 400 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Select</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userDD &&
                userDD.map((row: any) => (
                  <TableRow key={row.id}>
                    <TableCell align="right">{row.username}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">
                      <RedBtn onClick={() => handleSelectUser(row)}>
                        <DoneIcon />
                      </RedBtn>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

// Select Item - Add Item to the order
const SelectItem: FC<IEditOrderSubComponents> = ({ order, dispatch }) => {
  const [category, setCategory] = useState(0);
  const [item, setItem] = useState(0);
  const iDD = useSelector(selectItemDD);
  const cDD = useSelector(selectCategoriesDD);

  // Fetch ItemDD Options every time a different category is selected.
  useEffect(() => {
    if (category) {
      dispatch(fetchItemDD(category));
    } else {
      setItem(0);
    }
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };
  const handleItemChange = (e: any) => {
    setItem(e.target.value);
  };

  const handleAddItem = () => {
    if (item === 0) {
      toast.warn('Select a valid item');
    } else {
      let newOrder = JSON.parse(JSON.stringify(order));
      let itemDD = iDD.filter((i:any) => i.id === item)[0];
      let newItem = {
        ...itemDD,
        category: { id: itemDD.category, name: '' },
        description: '',
      };
      newOrder.items.push(newItem);
      dispatch(setSelectedOrder(newOrder));
      setCategory(0);
    }
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: '700' }} variant="h5" mb={1}>
        SELECT ITEM
      </Typography>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <CustomSelect
          label="Select Category"
          id="select-category"
          value={category}
          options={
            cDD ? [...cDD, { id: 0, name: 'None' }] : [{ id: 0, name: 'None' }]
          }
          handleChange={handleCategoryChange}
        />
        <CustomSelect
          label="Select Item"
          id="select-item"
          value={item}
          options={
            category && iDD
              ? [...iDD, { id: 0, name: 'None' }]
              : [{ id: 0, name: 'None' }]
          }
          handleChange={handleItemChange}
        />
        <RedBtn variant="outlined" onClick={handleAddItem}>
          Add
        </RedBtn>
      </Stack>
    </Box>
  );
};

// List Item - Remove item from the orser
const ListItems: FC<IEditOrderSubComponents> = ({
  order,
  dispatch,
  formik,
}) => {
  const handleRemoveItem = (id: number) => {
    let newOrder = JSON.parse(JSON.stringify(order));
    newOrder.items = newOrder.items.filter((item: OrderItem) => item.id !== id);
    dispatch(setSelectedOrder(newOrder));
  };
  return (
    <Box>
      <Typography sx={{ fontWeight: '700' }} variant="h5" mb={1}>
        List ITEMS
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
            <RedBtn onClick={() => handleRemoveItem(item.id)}>
              <DeleteIcon />
            </RedBtn>
          </Stack>
        ))}
      </Stack>
      <Typography sx={{ color: 'red', mt: 1 }}>
        {formik.errors?.items && formik.errors.items?.toString()}
      </Typography>
    </Box>
  );
};

export default EditOrder;
