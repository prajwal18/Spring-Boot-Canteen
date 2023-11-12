import { Box, LinearProgress, Typography } from '@mui/material';
import React, { FC } from 'react';
import CustomTextField from '../../components/form/CustomTextField';

interface IGetOTP {
  formik: any;
}
const GetOTP: FC<IGetOTP> = ({ formik }) => {
  return (
    <>
      <CustomTextField
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        type="email"
        helperText={formik.touched.email ? formik.errors.email : ''}
        disabled={formik.isSubmitting}
        error={formik.touched.email && Boolean(formik.errors.email)}
        extraProps={{ required: true }}
      />
    </>
  );
};

export default GetOTP;
