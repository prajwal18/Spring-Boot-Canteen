import {
  TableContainer,
  Table,
  TableBody,
  Box,
  TableRow,
  TableCell,
  Stack,
  Typography,
} from '@mui/material';

// ICONS
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Username
import EmailIcon from '@mui/icons-material/Email'; // Email
import WorkIcon from '@mui/icons-material/Work'; // Roles
import EventIcon from '@mui/icons-material/Event'; // Created On
import SettingsIcon from '@mui/icons-material/Settings'; // Setting
import CustomTableHeader from '../../components/table/CustomTableHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  UserType,
  deleteUser,
  selectUsers,
  selectUsersError,
  selectUsersIsLoading,
  selectUsersPage,
  selectUsersPageSize,
  selectUsersSort,
  setSelectedUser,
  setUsersSort,
} from '../../redux/slice/userSlice';
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from '../../components/styled-components/Button';
import { getDateTime } from '../../utils/dateTimeConverter';
import { useState } from 'react';
import { AppDispatch } from '../../redux/store';
import ViewUser from '../../components/modals/ViewUser';
import DeleteConfirmation from '../../components/modals/DeleteConfirmation';
import AddEditUser from '../../components/modals/AddEditUser';
// ICONS

const manageUsersHeaderData = [
  {
    label: 'Username',
    icon: <AccountCircleIcon />,
    sort: {
      by: 'username',
      action: setUsersSort,
      sliceSort: selectUsersSort,
    },
  },
  {
    label: 'email',
    icon: <EmailIcon />,
  },
  {
    label: 'Roles',
    icon: <WorkIcon />,
  },
  {
    label: 'Created On',
    icon: <EventIcon />,
    sort: {
      by: 'createdOn',
      action: setUsersSort,
      sliceSort: selectUsersSort,
    },
  },
  {
    label: 'Actions',
    icon: <SettingsIcon />,
  },
];

const ManageUsersTable = () => {
  return (
    <>
      <TableContainer component={Box}>
        <Table>
          <CustomTableHeader
            includeSN={true}
            headerData={manageUsersHeaderData}
          />
          <UserTableBody />
        </Table>
      </TableContainer>
    </>
  );
};

const UserTableBody = () => {
  const users = useSelector(selectUsers);
  const page = useSelector(selectUsersPage);
  const pageSize = useSelector(selectUsersPageSize);
  const isLoading = useSelector(selectUsersIsLoading);
  const error = useSelector(selectUsersError);
  const dispatch = useDispatch<AppDispatch>();

  //-- Modal function and state --
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // handle select user
  const handleSelectUser = (user: UserType) => {
    dispatch(setSelectedUser(user));
  };

  // Open and close modals
  const handleOpenView = (user: UserType) => {
    handleSelectUser(user);
    setOpenView(true);
  };
  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleOpenEdit = (user: UserType) => {
    handleSelectUser(user);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleOpenDeleteConfirmation = (user: UserType) => {
    handleSelectUser(user);
    setOpenDelete(true);
  };
  const handleCloseDeleteConfirmation = () => {
    setOpenDelete(false);
  };
  // Open and close modals

  // handle Delete confirmation
  const handleDeleteConfirmation = () => {
    dispatch(deleteUser({}));
    handleCloseDeleteConfirmation();
  };
  //-- Modal function and state --
  return (
    <>
      <TableBody>
        {isLoading || error
          ? null
          : users && users.length > 0
          ? users.map((row: UserType, index: number) => (
              <TableRow key={index}>
                <TableCell>{page * pageSize + index + 1}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  {row.roles.map((role) => (
                    <Typography key={role.id}>- {role.name}</Typography>
                  ))}
                </TableCell>
                <TableCell>{getDateTime(row.createdOn)}</TableCell>
                <TableCell>
                  <Stack
                    sx={{ maxWidth: '200px' }}
                    direction="row"
                    justifyContent={'space-between'}
                  >
                    <ViewButton handleClick={() => handleOpenView(row)} />
                    <EditButton handleClick={() => handleOpenEdit(row)} />
                    <DeleteButton
                      handleClick={() => handleOpenDeleteConfirmation(row)}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
      {openView && <ViewUser open={openView} handleClose={handleCloseView} />}
      {openEdit && <AddEditUser open={openEdit} handleClose={handleCloseEdit} isEditing={true}/>}
      {openDelete && (
        <DeleteConfirmation
          open={openDelete}
          handleClose={handleCloseDeleteConfirmation}
          handleDelete={handleDeleteConfirmation}
          entity="User"
          warning="Deleting a user will delete their records from the order table."
        />
      )}
    </>
  );
};

export default ManageUsersTable;
