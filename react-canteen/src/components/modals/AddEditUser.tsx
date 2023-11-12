import React, { FC, useEffect, useState } from 'react';
import {
  Stack,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  addUser,
  editUser,
  selectSelectedUser,
} from '../../redux/slice/userSlice';
import { useFormik } from 'formik';
import { addEditUserSchema } from '../../utils/YupSchema';
import { AppDispatch } from '../../redux/store';
import { AddEditUserType } from '../../query/fn.user';
import { rolesOption } from '../../utils/PermissionInfo';
import CustomSelect from '../form/CustomSelect';
import { RedBtn } from '../styled-components/Button';
import { toast } from 'react-toastify';
//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import CustomPasswordField from '../form/CustomPasswordField';
//ICONS

interface IAddEditUser {
  open: boolean;
  handleClose: () => void;
  isEditing: boolean;
}

const userIV: AddEditUserType = {
  username: '',
  password: '',
  email: '',
  roles: [],
};

const AddEditUser: FC<IAddEditUser> = ({ open, handleClose, isEditing }) => {
  const user = useSelector(selectSelectedUser);
  const dispatch = useDispatch<AppDispatch>();
  const [role, setRole] = useState<string>('CUSTOMER');

  const formik = useFormik({
    initialValues: userIV,
    validationSchema: addEditUserSchema,
    enableReinitialize: true,
    onSubmit: (value: any) => {
      if (isEditing) {
        dispatch(editUser(value));
      } else {
        dispatch(addUser(value));
      }
      formik.resetForm();
      handleClose();
    },
  });

  useEffect(() => {
    if (isEditing && user?.username) {
      formik.setFieldValue('username', user.username);
      // This is there just to skip validation error, We actually won't be utilizing this field at all (while updating)
      formik.setFieldValue('password', 'password');
      formik.setFieldValue('email', user.email);
      const roles = user.roles.map((role: any) => role.name);
      formik.setFieldValue('roles', roles);
    }
  }, [user, isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'md'}>
      <DialogTitle id="add-edit-user">{`Add Edit User.`}</DialogTitle>
      <DialogContent>
        <Stack
          spacing={2}
          component="form"
          onSubmit={formik.handleSubmit}
          mt={2}
          sx={{ minWidth: '400px' }}
        >
          <TextField
            label="Username"
            name="username"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            fullWidth
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.username && formik.errors.username
                ? formik.errors.username.toString()
                : ''
            }
            error={formik.touched.username && Boolean(formik.errors.username)}
          />
          {!isEditing && (
            <CustomPasswordField
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              fullWidth
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password.toString()
                  : ''
              }
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
          )}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            fullWidth
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.email && formik.errors.email
                ? formik.errors.email.toString()
                : ''
            }
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          <SetRoleComponent formik={formik} role={role} setRole={setRole} />
          <Button
            sx={{ width: '100%', mt: 2 }}
            variant="outlined"
            type="submit"
          >
            Submit
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

interface ISetRoleComponent {
  formik: any;
  role: string;
  setRole: (value: any) => void;
}

const SetRoleComponent: FC<ISetRoleComponent> = ({ formik, role, setRole }) => {
  const handleChangeRole = (e: any) => {
    setRole(e.target.value);
  };
  const handleRemoveRole = (r: string) => {
    let currentRoles = JSON.parse(JSON.stringify(formik.values.roles));
    let newRoles = currentRoles.filter((rr: string) => rr !== r);
    formik.setFieldValue('roles', newRoles);
  };
  const handleAddRole = () => {
    let currentRoles = JSON.parse(JSON.stringify(formik.values.roles));
    if (currentRoles.find((rr: string) => role === rr)) {
      toast.warn('Role already selected.');
    } else {
      let newRoles = [...currentRoles, role];
      formik.setFieldValue('roles', newRoles);
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        gap={2}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <CustomSelect
          label="Select Role"
          id="select-user-role"
          value={role}
          options={rolesOption}
          handleChange={handleChangeRole}
        />
        <RedBtn type="button" onClick={handleAddRole}>
          Add
        </RedBtn>
      </Stack>

      {/* List of Roles */}
      <Stack p={2} spacing={1}>
        {formik.values.roles.map((role: string) => (
          <Stack direction="row" gap={2} key={role} alignItems="center">
            <Typography sx={{color:"rgb(0,100,200)", width:"120px"}}>{role}</Typography>
            <RedBtn onClick={() => handleRemoveRole(role)}>
              <DeleteIcon />
            </RedBtn>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default AddEditUser;
