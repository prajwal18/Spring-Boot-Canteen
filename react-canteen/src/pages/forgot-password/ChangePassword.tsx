import React, { FC } from 'react';
import CustomPasswordField from '../../components/form/CustomPasswordField';

interface IChangePassword {
  formik: any;
}
const ChangePassword: FC<IChangePassword> = ({ formik }) => {
  return (
    <>
      <CustomPasswordField
        name="newPassword"
        label="New Password"
        fullWidth
        margin="normal"
        value={formik.values.newPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        helperText={formik.touched.newPassword ? formik.errors.newPassword : ''}
        disabled={formik.isSubmitting}
        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
      />
      <CustomPasswordField
        name="rePassword"
        label="Re-Password"
        fullWidth
        margin="normal"
        value={formik.values.rePassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        helperText={formik.touched.rePassword ? formik.errors.rePassword : ''}
        disabled={formik.isSubmitting}
        error={formik.touched.rePassword && Boolean(formik.errors.rePassword)}
      />
    </>
  );
};

export default ChangePassword;
