import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/slice/sessionSlice';
import { routes } from '../utils/PermissionInfo';
import { Navigate } from 'react-router-dom';

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
    return children;
  } else {
    return <Navigate to={routes.MY_ORDERS} />;
  }
};

export default PublicOnlyRoute;
