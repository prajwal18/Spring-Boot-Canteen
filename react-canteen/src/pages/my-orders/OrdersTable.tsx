import {
  TableContainer,
  Table,
  TableBody,
  Box,
  TableRow,
  TableCell,
  Typography,
  Stack,
} from '@mui/material';

// ICONS
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Ordered By
import FastfoodIcon from '@mui/icons-material/Fastfood'; // items
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // total
import EventIcon from '@mui/icons-material/Event'; // Created At
import SettingsIcon from '@mui/icons-material/Settings'; // Setting
import CustomTableHeader from '../../components/table/CustomTableHeader';
import {
  OrderItem,
  OrderType,
  selectOrdersError,
  selectOrdersIsLoading,
  selectOrdersPage,
  selectOrdersPageSize,
  selectOrdersSort,
  selectOrders,
  setOrdersSort,
  setSelectedOrder,
  deleteOrder,
} from '../../redux/slice/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getDateTime } from '../../utils/dateTimeConverter';
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from '../../components/styled-components/Button';
import DeleteConfirmation from '../../components/modals/DeleteConfirmation';
import ViewOrder from '../../components/modals/ViewOrder';
import { useState } from 'react';
import { AppDispatch } from '../../redux/store';
import EditOrder from '../../components/modals/EditOrder';
// ICONS

const ordersHeaderData = [
  {
    label: 'Ordered By',
    icon: <AccountCircleIcon />,
    sort: {
      by: 'owner.username',
      action: setOrdersSort,
      sliceSort: selectOrdersSort,
    },
  },
  {
    label: 'Items',
    icon: <FastfoodIcon />,
  },
  {
    label: 'Total',
    icon: <AttachMoneyIcon />,
  },
  {
    label: 'Created On',
    icon: <EventIcon />,
    sort: {
      by: 'createdOn',
      action: setOrdersSort,
      sliceSort: selectOrdersSort,
    },
  },
  {
    label: 'Actions',
    icon: <SettingsIcon />,
  },
];

const OrdersTable = () => {
  return (
    <>
      <TableContainer component={Box}>
        <Table>
          <CustomTableHeader includeSN={true} headerData={ordersHeaderData} />
          <OrderTableBody />
        </Table>
      </TableContainer>
    </>
  );
};

const OrderTableBody = () => {
  const orders = useSelector(selectOrders);
  const page = useSelector(selectOrdersPage);
  const pageSize = useSelector(selectOrdersPageSize);
  const isLoading = useSelector(selectOrdersIsLoading);
  const error = useSelector(selectOrdersError);
  const dispatch = useDispatch<AppDispatch>();

  // Modals function & state
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const selectOrder = (order: OrderType) => {
    dispatch(setSelectedOrder(order));
  };

  const handleDelete = (order: OrderType) => {
    selectOrder(order);
    // handle delete
    setOpenDelete(true);
  };
  const handleOpen = (order: OrderType) => {
    selectOrder(order);
    // handle View
    setOpenView(true);
  };
  const handleEdit = (order: OrderType) => {
    selectOrder(order);
    // handle Edit
    setOpenEdit(true);
  };

  const handleDeleteConfirmation = () => {
    // Dispatch a call to delete your order.
    dispatch(deleteOrder({}));
    handleCloseDeleteModal();
  };
  const handleCloseDeleteModal = () => {
    setOpenDelete(false);
  };
  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  // Modals function & state
  return (
    <>
      <TableBody>
        {isLoading || error
          ? null
          : orders && orders.length > 0
          ? orders.map((row: OrderType, index: number) => (
              <TableRow key={index}>
                <TableCell>{page * pageSize + index + 1}</TableCell>
                <TableCell>{row.owner.username}</TableCell>
                <TableCell>
                  {row.items.map((item: OrderItem) => (
                    <Typography key={item.id}>
                      {item.name} {' - $'}
                      {item.price}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell>$ 17.34</TableCell>
                <TableCell>{getDateTime(row.createdOn)}</TableCell>
                <TableCell>
                  <Stack
                    sx={{ maxWidth: '200px' }}
                    direction="row"
                    justifyContent={'space-between'}
                  >
                    <ViewButton handleClick={() => handleOpen(row)} />
                    <EditButton handleClick={() => handleEdit(row)} />
                    <DeleteButton handleClick={() => handleDelete(row)} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
      {openDelete && (
        <DeleteConfirmation
          entity="Order"
          open={openDelete}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDeleteConfirmation}
        />
      )}
      {openView && <ViewOrder open={openView} handleClose={handleCloseView} />}
      {openEdit && <EditOrder open={openEdit} handleClose={handleCloseEdit} />}
    </>
  );
};

export default OrdersTable;
