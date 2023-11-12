import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/slice/sessionSlice';
import { routes } from '../utils/PermissionInfo';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Fab } from '@mui/material';

// ICON
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
// ICON

type PublicOnlyRouteProps = {
  children: JSX.Element;
};

const PublicOnlyRoute: FC<PublicOnlyRouteProps> = ({ children }) => {
  const [render, setRender] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 600);
  }, []);

  if (!render) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <>
        {children}
        <GoToOrderFAB />
      </>
    );
  } else {
    return <Navigate to={routes.MY_ORDERS} />;
  }
};

const GoToOrderFAB = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/order');
  };

  return (
    <Box sx={{ position: 'fixed', bottom: '50px', right: '50px' }}>
      <Fab
        title={'Go to order page.'}
        sx={{ position: 'relative', padding: '35px' }}
        color="info"
        onClick={handleClick}
      >
        <RestaurantMenuIcon fontSize="large" />
      </Fab>
    </Box>
  );
};

export default PublicOnlyRoute;
