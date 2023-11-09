import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableContainer,
  Table,
  TableBody,
  Stack,
  TextField,
  Typography,
  Box,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';

// ICONS
import FastfoodIcon from '@mui/icons-material/Fastfood'; // Item name
import FoodBankIcon from '@mui/icons-material/FoodBank'; // Item Category
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Item Price
import SettingsIcon from '@mui/icons-material/Settings'; // Setting
import AddIcon from '@mui/icons-material/Add';
// ICONS
import CustomTableHeader from '../../components/table/CustomTableHeader';
import {
  AddBtn,
  DeleteButton,
  EditButton,
  FilterButton,
  ViewButton,
} from '../../components/styled-components/Button';
import CustomTablePagination from '../../components/table/CustomTablePagination';
import { AppDispatch } from '../../redux/store';
import {
  ItemType,
  deleteItem,
  fetchItems,
  selectItemError,
  selectItemIsLoading,
  selectItems,
  selectItemsPage,
  selectItemsPageSize,
  selectItemsSearchterm,
  selectItemsSort,
  selectTotalItems,
  setItemsPage,
  setItemsPageSize,
  setItemsSearchTerm,
  setItemsSort,
  setSelectedItem,
} from '../../redux/slice/itemSlice';
import {
  selectSelectedCategory,
  setSelectedCategory,
} from '../../redux/slice/categorySlice';
import DeleteConfirmation from '../../components/modals/DeleteConfirmation';
import ViewItem from '../../components/modals/ViewItem';
import AddEditItem from '../../components/modals/AddEditItem';

const itemHeaderData = [
  {
    label: 'Name',
    icon: <FastfoodIcon />,
    sort: {
      by: 'name',
      action: setItemsSort,
      sliceSort: selectItemsSort,
    },
  },
  {
    label: 'Category',
    icon: <FoodBankIcon />,
  },
  {
    label: 'Price',
    icon: <AttachMoneyIcon />,
    sort: {
      by: 'price',
      action: setItemsSort,
      sliceSort: selectItemsSort,
    },
  },
  {
    label: 'Actions',
    icon: <SettingsIcon />,
  },
];

const ItemTableContent = () => {
  return (
    <TableContainer component={Box}>
      <Table>
        <CustomTableHeader includeSN={false} headerData={itemHeaderData} />
        <ItemTableBody />
      </Table>
    </TableContainer>
  );
};

const ItemTable = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => {
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
  const dispatch = useDispatch<AppDispatch>();
  // Pagination
  const page = useSelector(selectItemsPage);
  const pageSize = useSelector(selectItemsPageSize);
  const sort = useSelector(selectItemsSort);
  const total = useSelector(selectTotalItems);
  const searchTerm = useSelector(selectItemsSearchterm);
  const category = useSelector(selectSelectedCategory);
  const setPage = (page: number) => {
    dispatch(setItemsPage(page));
  };
  const setPageSize = (size: number) => {
    dispatch(setItemsPageSize(size));
  };
  // Pagination

  const handleSearchTermChange = (e: any) => {
    const string = e.target.value;
    dispatch(setItemsSearchTerm(string));
  };

  // Fetching Items
  useEffect(() => {
    dispatch(fetchItems({}));
  }, [dispatch, page, pageSize, searchTerm, sort, category]);
  // Fetching Items
  return (
    <>
      <Stack
        spacing={1}
        sx={{ flexGrow: '1', border: '1px solid rgba(0,0,0,0.2)' }}
      >
        <Stack
          direction="row"
          gap={2}
          justifyContent={'space-between'}
          sx={{ padding: '20px' }}
        >
          <Stack direction="row" gap={2}>
            <TextField
              hidden={true}
              label="Search"
              variant="standard"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <FilterButton setOpen={setOpenFilter} open={openFilter} />
          </Stack>
          <AddBtn onClick={handleOpenAdd}>
            <AddIcon />
            <Typography>Item</Typography>
          </AddBtn>
        </Stack>
        {openFilter && (
          <SelectCategory dispatch={dispatch} category={category} />
        )}
        <ItemTableContent />
        <CustomTablePagination
          page={page}
          setPage={setPage}
          rowsPerPage={pageSize}
          setRowsPerPage={setPageSize}
          total={total}
        />
      </Stack>
      {openAdd && (
        <AddEditItem
          isEditing={false}
          open={openAdd}
          handleClose={handleCloseAdd}
        />
      )}
    </>
  );
};

const SelectCategory = ({
  dispatch,
  category,
}: {
  dispatch: any;
  category: any;
}) => {
  const handleSelectAllCategories = () => {
    dispatch(setSelectedCategory({ id: 0, name: 'All' }));
  };
  return (
    <Stack
      sx={{ padding: '0 20px' }}
      direction="row"
      gap={2}
      alignItems={'center'}
    >
      <Button onClick={handleSelectAllCategories} variant="contained">
        {category.id ? 'Reset' : 'All Categories'}
      </Button>
      {category.id !== 0 && <Typography>Selected - {category.name}</Typography>}
    </Stack>
  );
};

const ItemTableBody = () => {
  const items = useSelector(selectItems);
  const isLoading = useSelector(selectItemIsLoading);
  const error = useSelector(selectItemError);
  const dispatch = useDispatch<AppDispatch>();

  const handleSelectItem = (data: ItemType) => {
    dispatch(setSelectedItem(data));
  };
  // Modal Functions and state
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = (data: ItemType) => {
    handleSelectItem(data);
    // handle delete
    setOpenDelete(true);
  };
  const handleEdit = (data: ItemType) => {
    handleSelectItem(data);
    // handle Edit
    setOpenEdit(true);
  };
  const handleView = (data: ItemType) => {
    handleSelectItem(data);
    setOpenView(true);
  };

  const handleDeleteConfirmation = () => {
    dispatch(deleteItem({}));
    handleCloseDelete();
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleCloseView = () => {
    setOpenView(false);
  };
  // Modal Functions and state
  return (
    <>
      <TableBody>
        {isLoading || error
          ? null
          : items && items.length > 0
          ? items.map((row: ItemType, index: number) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category.name}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>
                  <Stack
                    sx={{ maxWidth: '200px' }}
                    direction="row"
                    justifyContent={'space-between'}
                  >
                    <ViewButton handleClick={() => handleView(row)} />
                    <EditButton handleClick={() => handleEdit(row)} />
                    <DeleteButton handleClick={() => handleDelete(row)} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
      {openView && <ViewItem open={openView} handleClose={handleCloseView} />}
      {openEdit && (
        <AddEditItem
          isEditing={true}
          open={openEdit}
          handleClose={handleCloseEdit}
        />
      )}
      {openDelete && (
        <DeleteConfirmation
          open={openDelete}
          handleClose={handleCloseDelete}
          handleDelete={handleDeleteConfirmation}
          entity="Item"
          warning="Items with existing records in the order table will not be deleted."
        />
      )}
    </>
  );
};

export default ItemTable;
