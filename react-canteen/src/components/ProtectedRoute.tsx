import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../redux/slice/sessionSlice';
import NotFound from '../pages/404';
import { userHasAnyPermissions } from '../utils/PermissionInfo';

type ProtectedRouteType = {
  permissions: Array<string>;
  children: JSX.Element;
};

const ProtectedRoute: FC<ProtectedRouteType> = ({ permissions, children }) => {
  const [render, setRender] = useState(false);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 600);
  }, []);

  if (!render) {
    return null;
  }
  if (user?.roles && userHasAnyPermissions(user.roles, permissions)) {
    return children;
  } else {
    return <NotFound />;
  }
};

export default ProtectedRoute;
