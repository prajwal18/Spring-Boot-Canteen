import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { retriveLoggedInStatusFromCookie } from '../utils/cookieUtil';

const useIsLoggedIn = (initialState: boolean, pageIsLoginOrReg: boolean) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialState);

  useEffect(() => {
    if (retriveLoggedInStatusFromCookie() === 'true') {
      // Why -> Users will be redirected from login or registration page if they are logged in.
      if (pageIsLoginOrReg) {
        navigate('/');
      }
      setIsLoggedIn(true);
    } else {
      // Why -> Users will be redirected to login page if they try to access a page that requires authentication.
      if (!pageIsLoginOrReg) {
        navigate('/login');
      }
      setIsLoggedIn(false);
    }
  }, [pageIsLoginOrReg]); //eslint-disable-line react-hooks/exhaustive-deps

  return isLoggedIn;
};

export default useIsLoggedIn;
