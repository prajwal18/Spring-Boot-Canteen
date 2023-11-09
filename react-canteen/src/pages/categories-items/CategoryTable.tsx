import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  Box,
  Stack,
  TextField,
  Typography,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';

// ICONS
import FoodBankIcon from '@mui/icons-material/FoodBank'; // Category
import SettingsIcon from '@mui/icons-material/Settings'; // Setting
import AddIcon from '@mui/icons-material/Add';
// ICONS
import CustomTableHeader from '../../components/table/CustomTableHeader';
import {
  AddBtn,
  DeleteButton,
  EditButton,
} from '../../components/styled-components/Button';
import CustomTablePagination from '../../components/table/CustomTablePagination';
import { useDispatch, useSelector } from 'react-redux';
import {
  CategoryType,
  deleteCategory,
  fetchCategories,
  selectCategories,
  selectCategoriesPage,
  selectCategoriesPageSize,
  selectCategoriesSearchterm,
  selectCategoriesSort,
  selectCategoryError,
  selectCategoryIsLoading,
  selectSelectedCategory,
  selectTotalCategories,
  setCategoriesPage,
  setCategoriesPageSize,
  setCategoriesSearchTerm,
  setCategoriesSort,
  setSelectedCategory,
} from '../../redux/slice/categorySlice';
import { AppDispatch } from '../../redux/store';
import DeleteConfirmation from '../../components/modals/DeleteConfirmation';
import AddEditCategory from '../../components/modals/AddEditCategory';

const categoryHeaderData = [
  {
    label: 'Category',
    icon: <FoodBankIcon />,
    sort: {
      by: 'name',
      action: setCategoriesSort,
      sliceSort: selectCategoriesSort,
    },
  },
  {
    label: 'Actions',
    icon: <SettingsIcon />,
  },
];

const CategoryTableContent = () => {
  return (
    <TableContainer component={Box}>
      <Table>
        <CustomTableHeader includeSN={false} headerData={categoryHeaderData} />
        <CategoryTableBody />
      </Table>
    </TableContainer>
  );
};

const CategoryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);

  const handleOpenAddCategory = () => {
    setOpenAddCategoryModal(true);
  };
  const handleCloseAddCategory = () => {
    setOpenAddCategoryModal(false);
  };
  // Pagination
  const page = useSelector(selectCategoriesPage);
  const pageSize = useSelector(selectCategoriesPageSize);
  const sort = useSelector(selectCategoriesSort);
  const total = useSelector(selectTotalCategories);
  const searchTerm = useSelector(selectCategoriesSearchterm);
  const setPage = (page: number) => {
    dispatch(setCategoriesPage(page));
  };
  const setPageSize = (size: number) => {
    dispatch(setCategoriesPageSize(size));
  };
  // Pagination

  const handleSearchTermChange = (e: any) => {
    const string = e.target.value;
    dispatch(setCategoriesSearchTerm(string));
  };

  // Fetching Categories
  useEffect(() => {
    dispatch(fetchCategories({}));
  }, [dispatch, page, pageSize, searchTerm, sort]);
  // Fetching Categories
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
          <TextField
            hidden={true}
            label="Search"
            variant="standard"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <AddBtn onClick={handleOpenAddCategory}>
            <AddIcon />
            <Typography>Category</Typography>
          </AddBtn>
        </Stack>
        <CategoryTableContent />
        <CustomTablePagination
          page={page}
          setPage={setPage}
          rowsPerPage={pageSize}
          setRowsPerPage={setPageSize}
          total={total}
        />
      </Stack>
      {openAddCategoryModal && (
        <AddEditCategory
          open={openAddCategoryModal}
          handleClose={handleCloseAddCategory}
          isEditing={false}
        />
      )}
    </>
  );
};

const CategoryTableBody = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoryIsLoading);
  const error = useSelector(selectCategoryError);
  const selectedCategory: CategoryType = useSelector(selectSelectedCategory);

  const handleSelectCategory = (data: CategoryType) => {
    dispatch(setSelectedCategory(data));
  };
  // Modal Functions and state
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = (data: CategoryType) => {
    handleSelectCategory(data);
    // handle delete
    setOpenDelete(true);
  };
  const handleEdit = (data: CategoryType) => {
    handleSelectCategory(data);
    // handle Edit
    setOpenEdit(true);
  };

  const handleDeleteConfirmation = () => {
    // Dispatch a call to delete your order.
    dispatch(deleteCategory({}));
    handleCloseDeleteModal();
  };
  const handleCloseDeleteModal = () => {
    setOpenDelete(false);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  // Modal Functions and state

  return (
    <>
      <TableBody>
        {isLoading || error
          ? null
          : categories && categories.length > 0
          ? categories.map((row: CategoryType, index: number) => (
              <TableRow
                key={index}
                sx={{
                  background:
                    selectedCategory?.id === row.id
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Stack sx={{ maxWidth: '150px' }} spacing={1}>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent={'space-between'}
                    >
                      <EditButton handleClick={() => handleEdit(row)} />
                      <DeleteButton handleClick={() => handleDelete(row)} />
                    </Stack>
                    <Button
                      sx={{
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { background: 'rgba(0,0,0,0.8)' },
                      }}
                      onClick={() => handleSelectCategory(row)}
                    >
                      See Items
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
      {openEdit && (
        <AddEditCategory
          open={openEdit}
          handleClose={handleCloseEdit}
          isEditing={true}
        />
      )}
      {openDelete && (
        <DeleteConfirmation
          open={openDelete}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDeleteConfirmation}
          entity="Category"
        />
      )}
    </>
  );
};

export default CategoryTable;
