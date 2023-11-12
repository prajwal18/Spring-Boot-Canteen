import React, { FC } from 'react';
import CustomTextField from '../../components/form/CustomTextField';
import { Button, Stack } from '@mui/material';

interface IVerifyOTP {
  formik: any;
  handleGoBack: () => void;
  handleResendOTP: () => void;
}
const VerifyOTP: FC<IVerifyOTP> = ({
  formik,
  handleGoBack,
  handleResendOTP,
}) => {
  return (
    <>
      <CustomTextField
        name="otp"
        label="OTP"
        value={formik.values.otp}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        type="otp"
        helperText={formik.touched.otp ? formik.errors.otp : ''}
        disabled={formik.isSubmitting}
        error={formik.touched.otp && Boolean(formik.errors.otp)}
        extraProps={{ required: true }}
      />
      <Stack mt={1} direction="row" gap={2}>
        <Button variant="outlined" onClick={handleGoBack}>
          Go Back
        </Button>
        <Button variant="outlined" onClick={handleResendOTP}>
          Resend OTP
        </Button>
      </Stack>
    </>
  );
};

export default VerifyOTP;
