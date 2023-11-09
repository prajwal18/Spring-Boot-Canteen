import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { selectIsLoggedIn } from '../redux/slice/sessionSlice';
import { routes } from '../utils/PermissionInfo';

const primary = purple[500]; // #f44336

const NotFound = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h1" style={{ color: 'white' }}>
          404
        </Typography>
        <Typography variant="h6" style={{ color: 'white' }}>
          The page you’re looking for doesn’t exist.
        </Typography>
      </Stack>
      {isLoggedIn ? (
        <Link to={routes.MY_ORDERS}>Go back to home</Link>
      ) : (
        <Link to={routes.LOGIN}>Go back to login</Link>
      )}
    </Box>
  );
};
export default NotFound;
