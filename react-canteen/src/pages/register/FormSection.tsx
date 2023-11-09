import {
  Container,
  Box,
  Typography,
  CssBaseline,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import CustomTextField from '../../components/form/CustomTextField';
import { Link } from 'react-router-dom';

const FormSection = ({ formik }: { formik: any }) => {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: '50%',
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
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h4">
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <CustomTextField
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            helperText={formik.touched.username ? formik.errors.username : ''}
            disabled={formik.isSubmitting}
            error={formik.touched.username && Boolean(formik.errors.username)}
            extraProps={{ required: true }}
          />
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
          <CustomTextField
            name="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="password"
            helperText={formik.touched.password ? formik.errors.password : ''}
            disabled={formik.isSubmitting}
            error={formik.touched.password && Boolean(formik.errors.password)}
            extraProps={{ required: true }}
          />

          <Button
            color="secondary"
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {formik.isSubmitting ? (
              <CircularProgress color="inherit" />
            ) : (
              'Sign up'
            )}
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default FormSection;
