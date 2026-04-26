import { Navigate, Outlet, useLocation } from 'react-router';
import { hasAdminToken } from './adminAuth';

const LOGIN_ROUTE = '/admin/login';

const RequireAdminAuth = (): JSX.Element => {
  const location = useLocation();

  if (!hasAdminToken()) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={LOGIN_ROUTE} replace state={{ from }} />;
  }

  return <Outlet />;
};

export default RequireAdminAuth;
