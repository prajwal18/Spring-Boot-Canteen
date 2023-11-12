import { useFormik } from 'formik';
import React, { FC, useState } from 'react';
import { forgotPasswordSchema } from '../../utils/YupSchema';
import { LoginRegistrationContainer } from '../../components/styled-components/Container';
import GetOTP from './GetOTP';
import VerifyOTP from './VerifyOTP';
import ChangePassword from './ChangePassword';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  LinearProgress,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

// ICON
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  changePasswordOTPFn,
  checkOTPFn,
  getOTPFn,
} from '../../query/fn.forgotPW';
// ICON

enum Pages {
  GET_OTP,
  CHECK_OTP,
  RESET_PW,
}
const initialValues = {
  email: '',
  otp: '',
  newPassword: '',
  rePassword: '',
};
const ForgotPassword = () => {
  const [page, setPage] = useState<Pages>(Pages.GET_OTP); // Possible values 0,1,2
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: forgotPasswordSchema[page],
    enableReinitialize: true,
    onSubmit: async (values) => {
      switch (page) {
        case 0:
          let success = await getOTPFn(values.email);
          if (success) {
            setPage(Pages.CHECK_OTP);
          }
          break;
        case 1:
          let success2 = await checkOTPFn(values.email, values.otp);
          if (success2) {
            setPage(Pages.RESET_PW);
          }
          break;
        case 2:
          let success3 = await changePasswordOTPFn(
            values.email,
            values.otp,
            values.newPassword,
          );
          if (success3) {
            formik.resetForm();
            navigate('/login');
            setPage(Pages.GET_OTP);
          }
          break;
        default:
          console.log('Hello');
      }
      formik.setSubmitting(false);
    },
  });

  // Helpful functions
  const handleGoBack = () => {
    setPage((page) => (page === 0 ? 0 : page - 1));
  };
  const handleResendOTP = async () => {
    formik.setSubmitting(true);
    await getOTPFn(formik.values.email);
    formik.setSubmitting(false);
  };
  // Helpful functions

  const getPageBody = (pageNo: number) => {
    switch (pageNo) {
      case 0:
        return <GetOTP formik={formik} />;
      case 1:
        return (
          <VerifyOTP
            formik={formik}
            handleGoBack={handleGoBack}
            handleResendOTP={handleResendOTP}
          />
        );
      case 2:
        return <ChangePassword formik={formik} />;
      default:
        return <></>;
    }
  };

  return (
    <ForgotPasswordContainer>
      <Box
        component="form"
        sx={{ width: '100%', mt: 1, px: 2 }}
        onSubmit={formik.handleSubmit}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          {page === 0 ? 'GET OTP' : page === 1 ? 'CHECK OTP' : 'New Password'}
        </Typography>
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={25 + page * 25} />
        </Box>
        {/* -------- MAIN FORM BODY -------- */}
        {getPageBody(page)}
        {/* -------- MAIN FORM BODY -------- */}
        <SubmitButton isSubmitting={formik.isSubmitting} />
      </Box>
    </ForgotPasswordContainer>
  );
};

const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => {
  return (
    <Button
      color="secondary"
      type="submit"
      fullWidth
      variant="contained"
      disabled={isSubmitting}
      sx={{ mt: 1 }}
    >
      {isSubmitting ? <CircularProgress color="inherit" /> : 'Next'}
    </Button>
  );
};

interface IForgotPasswordContainer {
  children: JSX.Element;
}
const ForgotPasswordContainer: FC<IForgotPasswordContainer> = ({
  children,
}) => {
  return (
    <LoginRegistrationContainer>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            margin: '0 auto',
            marginTop: '200px',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            padding: '30px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '5px',
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Reset Password
          </Typography>

          {/*FORM CONTENT */}
          {children}
          {/*FORM CONTENT */}

          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            Don't have an Account? <Link to="/register">Register</Link>
          </Typography>
          <Typography sx={{ textAlign: 'center' }}>
            Go back to <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Container>
    </LoginRegistrationContainer>
  );
};

export default ForgotPassword;
