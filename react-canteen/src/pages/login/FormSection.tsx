import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CustomTextField from '../../components/form/CustomTextField';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const loginInputStyle = {
  '& .MuiInputLabel-root': { color: 'green' }, //styles the label
  '& .MuiOutlinedInput-root': {
    '& > fieldset': {
      borderColor: 'black',
      borderWidth: '2px',
      borderRadius: '10px',
    },
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    '& > fieldset': {
      borderColor: 'black',
    },
  },
};

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Log In
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
            error={formik.touched.username && Boolean(formik.errors.username)}
            disabled={formik.isSubmitting}
            extraProps={{ required: true }}
            style={loginInputStyle}

          />
          <CustomTextField
            name="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="password"
            helperText={formik.touched.password ? formik.errors.password : ''}
            error={formik.touched.password && Boolean(formik.errors.password)}
            disabled={formik.isSubmitting}
            extraProps={{ required: true }}
            style={loginInputStyle}
          />

          <Button
            color="secondary"
            type="submit"
            fullWidth
            disabled={formik.isSubmitting}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {
              formik.isSubmitting?
              <CircularProgress color="inherit"/>
              : "Log In"
            }
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Don't have an Account? <Link to="/register">Register</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default FormSection;
