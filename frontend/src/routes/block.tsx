import { useSyncExternalStore, type FC, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';

const subscribe = () => () => {};

const Block: FC<{ children: ReactNode }> = ({ children }) => {
    const isClient = useSyncExternalStore(subscribe, () => true, () => false);
    const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

    if (!isClient) {
        return <>{children}</>;
    }

    if (isAuthenticated) {
        if (role === 'Admin') {
            return <Navigate to="/admin" replace />;
        } else if (role === 'Customer') {
            return <Navigate to="/customer" replace />;
        }
    }

    return <>{children}</>;
}

export default Block;