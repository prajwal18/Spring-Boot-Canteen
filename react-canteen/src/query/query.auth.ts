import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { retriveLoggedInStatusFromCookie } from '../utils/cookieUtil';
import { fetchSession } from '../redux/slice/sessionSlice';

export const useHasSessionExpired = () => {
  const dispatch = useDispatch();
  return useQuery('session-check', callFetchSessionInRedux(dispatch), {
    staleTime: 10000, // 100 seconds,
    cacheTime: 20000
  });
};

export const callFetchSessionInRedux = (dispatch: any) => () => {
  if (retriveLoggedInStatusFromCookie() === 'true') {
    dispatch(fetchSession());
  }
};
