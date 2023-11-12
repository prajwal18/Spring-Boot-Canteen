import { FC } from 'react';
import {
  Stack,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { UserType, selectSelectedUser } from '../../redux/slice/userSlice';
import { AppDispatch } from '../../redux/store';
import { useFormik } from 'formik';
import { changePasswordSchema } from '../../utils/YupSchema';
import { changePasswordByUserFn } from '../../query/fn.user';
import { clearSession } from '../../redux/slice/sessionSlice';
import CustomPasswordField from '../form/CustomPasswordField';

interface IChangePassword {
  open: boolean;
  handleClose: () => void;
}

const ChangePassword: FC<IChangePassword> = ({ open, handleClose }) => {
  const user = useSelector(selectSelectedUser);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle id="change-password">{`Change Password User - ${user.username}`}</DialogTitle>
      <FormSection user={user} />
    </Dialog>
  );
};

interface IFormSection {
  user: UserType;
}

const FormSection: FC<IFormSection> = ({ user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '' },
    validationSchema: changePasswordSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      let success = await changePasswordByUserFn(values, user.id);
      if(success){
        formik.resetForm();
        dispatch(clearSession({}));
      } else {
        formik.setFieldError("oldPassword", "The old password doesn't match.")
      }
    },
  });
  return (
    <Stack
    alignItems="center"
      gap={2}
      p={2}
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ minWidth: '400px', width:"100%" }}
    >
      <CustomPasswordField
        label="Old Password"
        name="oldPassword"
        value={formik.values.oldPassword}
        onChange={formik.handleChange}
        fullWidth
        onBlur={formik.handleBlur}
        helperText={
          formik.touched.oldPassword && formik.errors.oldPassword
            ? formik.errors.oldPassword.toString()
            : ''
        }
        disabled={formik.isSubmitting}
        error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
      />
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
        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
      />
      <Button variant="outlined" type="submit" disabled={formik.isSubmitting} sx={{width:"100%"}}>
        Submit
      </Button>
    </Stack>
  );
};

export default ChangePassword;
