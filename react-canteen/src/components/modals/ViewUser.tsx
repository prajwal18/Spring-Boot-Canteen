import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getDateTime } from '../../utils/dateTimeConverter';
import { UserType, selectSelectedUser } from '../../redux/slice/userSlice';
import { useFormik } from 'formik';
import { changePasswordSchema } from '../../utils/YupSchema';
import { changePasswordByAdminFn } from '../../query/fn.user';

// ICONS
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isUserAdmin } from '../../utils/PermissionInfo';
import { clearSession, selectAuthUser } from '../../redux/slice/sessionSlice';
import { AppDispatch } from '../../redux/store';
import CustomPasswordField from '../form/CustomPasswordField';
// ICONS

interface IViewUser {
  open: boolean;
  handleClose: () => void;
}

const ViewUser: FC<IViewUser> = ({ open, handleClose }) => {
  // We will fetch the selected user from userSlice.
  const user = useSelector(selectSelectedUser);
  const authUser = useSelector(selectAuthUser);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle id="view-user">{`View User - ${user.username}`}</DialogTitle>
      <ViewUserContent user={user} />
      {isUserAdmin(authUser) && (
        <ChangePasswordByAdminSection user={user} authUser={authUser} />
      )}
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export const ViewUserContent = ({ user }: { user: UserType }) => {
  return (
    <DialogContent>
      <Stack direction="row" gap={2} alignItems={'center'} mb={1}>
        <Typography sx={{ fontWeight: '700' }}>Userame:</Typography>
        <Typography>{user.username}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems={'center'} mb={1}>
        <Typography sx={{ fontWeight: '700' }}>Email:</Typography>
        <Typography>{user.email}</Typography>
      </Stack>
      <Box mb={2}>
        <Typography sx={{ fontWeight: '700' }} mb={1}>
          Roles:
        </Typography>
        <Stack px={2} spacing={1}>
          {user.roles.map((role) => (
            <Typography key={role.id}>{role.name}</Typography>
          ))}
        </Stack>
      </Box>
      <Stack direction="row" gap={2} alignItems={'center'}>
        <Typography sx={{ fontWeight: '700' }}>Created On:</Typography>
        <Typography>{getDateTime(user.createdOn)}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems={'center'} mb={1}>
        <Typography sx={{ fontWeight: '700' }}>Updated On:</Typography>
        <Typography>{getDateTime(user.updatedOn)}</Typography>
      </Stack>
    </DialogContent>
  );
};

// We only specify the value for the old password for the validation checker. It's value won't matter in this case.
// Change Password by Admin
const ChangePasswordByAdminSection = ({
  user,
  authUser,
}: {
  user: UserType;
  authUser: UserType;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showCP, setShowCP] = useState(false);
  const toggleShowCP = () => {
    !showCP && formik.resetForm(); // The form resets every time you close it.
    setShowCP(!showCP);
  };

  const formik = useFormik({
    initialValues: { oldPassword: 'password', newPassword: '' },
    validationSchema: changePasswordSchema,
    enableReinitialize: true,
    onSubmit: async (value) => {
      await changePasswordByAdminFn(value.newPassword, user.id);
      if (authUser.id === user.id) {
        dispatch(clearSession({}));
      }
      toggleShowCP();
    },
  });
  return (
    <Box p={2}>
      <Stack
        mb={2}
        direction="row"
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={2}
        aria-label="toggle-show-change-password"
      >
        <Typography variant="h5">Change Password</Typography>
        <Button onClick={toggleShowCP}>
          {showCP ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </Button>
      </Stack>
      {showCP && (
        <Stack
          direction="row"
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={2}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <CustomPasswordField
            label="New Password"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            fullWidth
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.newPassword && formik.errors.newPassword
                ? formik.errors.newPassword.toString()
                : ''
            }
            disabled={formik.isSubmitting}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
          />
          <Button
            variant="outlined"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Submit
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default ViewUser;
