// utils/cookieUtils.js
import nookies from 'nookies';

const COOKIE_NAME = 'redux_cart';

export const saveReduxStateToCookie = (reduxState) => {
  const serializedState = JSON.stringify(reduxState);
  nookies.set(null, COOKIE_NAME, serializedState, { path: '/' });
};

export const loadReduxStateFromCookie = () => {
  const cookie = nookies.get(null)[COOKIE_NAME];
  return cookie ? JSON.parse(cookie) : undefined;
};
