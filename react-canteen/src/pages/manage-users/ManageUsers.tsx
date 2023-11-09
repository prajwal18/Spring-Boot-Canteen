import { useEffect, useState } from 'react';
import {
  TextField,
  Select,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  AddBtn,
  FilterButton,
} from '../../components/styled-components/Button';
import {
  TableFilterStackContainer,
  TablePageContainer,
} from '../../components/styled-components/Container';
import CustomTablePagination from '../../components/table/CustomTablePagination';
import ManageUsersTable from './ManageUsersTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  fetchUsers,
  selectTotalUsers,
  selectUsersPage,
  selectUsersPageSize,
  selectUsersRoleFilter,
  selectUsersSearchterm,
  selectUsersSort,
  setUsersPage,
  setUsersPageSize,
  setUsersRoleFilter,
  setUsersSearchTerm,
} from '../../redux/slice/userSlice';
import AddEditUser from '../../components/modals/AddEditUser';

const ManageUsers = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState(false); // state to open add new user's modal
  const handleOpenAddNewUser = () => {
    setOpenAdd(true);
  };
  const handleCloseAddNewUser = () => {
    setOpenAdd(false);
  };
  const dispatch = useDispatch<AppDispatch>();
  // Pagination
  const page = useSelector(selectUsersPage);
  const pageSize = useSelector(selectUsersPageSize);
  const sort = useSelector(selectUsersSort);
  const total = useSelector(selectTotalUsers);
  const searchTerm = useSelector(selectUsersSearchterm);
  const roleFilter = useSelector(selectUsersRoleFilter);
  const setPage = (page: number) => {
    dispatch(setUsersPage(page));
  };
  const setPageSize = (size: number) => {
    dispatch(setUsersPageSize(size));
  };
  // Pagination

  const handleSearchTermChange = (e: any) => {
    const string = e.target.value;
    dispatch(setUsersSearchTerm(string));
  };

  // Fetching Users
  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [dispatch, page, pageSize, searchTerm, sort, roleFilter]);
  // Fetching Users

  return (
    <>
      <TablePageContainer
        topic="Users"
        subTopic="Manage Users"
        fsChildren={
          <>
            <Stack direction="row" spacing={2}>
              <TextField
                hidden={true}
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchTermChange}
                sx={{ minWidth: '200px', marginLeft: '20px' }}
              />
              <FilterButton setOpen={setOpenFilter} open={openFilter} />
            </Stack>
            <AddBtn onClick={handleOpenAddNewUser}>
              <AddIcon />
              <Typography>New User</Typography>
            </AddBtn>
          </>
        }
      >
        {openFilter ? <TableFilterStack /> : <></>}

        <ManageUsersTable />
        <CustomTablePagination
          page={page}
          setPage={setPage}
          rowsPerPage={pageSize}
          setRowsPerPage={setPageSize}
          total={total}
        />
      </TablePageContainer>
      {openAdd && (
        <AddEditUser
          open={openAdd}
          handleClose={handleCloseAddNewUser}
          isEditing={false}
        />
      )}
    </>
  );
};

const TableFilterStack = () => {
  const dispatch = useDispatch<AppDispatch>();
  const roleFilter = useSelector(selectUsersRoleFilter);
  const handleChange = (e: any) => {
    const value = e.target.value;
    dispatch(setUsersRoleFilter(value));
  };
  return (
    <TableFilterStackContainer>
      {/* Drop down component to narrow down search by the order-item */}
      <FormControl fullWidth>
        <InputLabel id="user-role-label">Role</InputLabel>
        <Select
          labelId="user-role-label"
          id="user-role"
          value={roleFilter}
          label="Role"
          onChange={handleChange}
        >
          <MenuItem value={'ALL'}>ALL</MenuItem>
          <MenuItem value={'CUSTOMER'}>CUSTOMER</MenuItem>
          <MenuItem value={'STAFF'}>STAFF</MenuItem>
          <MenuItem value={'ADMIN'}>ADMIN</MenuItem>
        </Select>
      </FormControl>
    </TableFilterStackContainer>
  );
};

export default ManageUsers;
