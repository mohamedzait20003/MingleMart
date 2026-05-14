import { useSyncExternalStore, type FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import type { RootState } from '../store';

const subscribe = () => () => {};

const Redirect: FC = () => {
    const isClient = useSyncExternalStore(subscribe, () => true, () => false);
    const { role, isAuthenticated, isVerified } = useSelector((state: RootState) => state.auth);

    if (!isClient) {
        return null;
    }

    if (!isAuthenticated) return <Navigate to="/home" replace />;
    if (!isVerified) return <Navigate to="/authenticate/account-verify" replace />;
    
    if (role === 'Admin') return <Navigate to="/admin" replace />;
    if (role === 'Customer') return <Navigate to="/customer" replace />;

    return <Navigate to="/home" replace />;
};

export default Redirect;