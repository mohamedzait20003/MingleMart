import { useSyncExternalStore, type FC, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store";

const subscribe = () => () => {};

const Protected: FC<{ children: ReactNode, Roles?: string[] }> = ({ children, Roles }) => {
    const isClient = useSyncExternalStore(subscribe, () => true, () => false);
    const { isAuthenticated, isVerified, role } = useSelector((state: RootState) => state.auth);

    if (!isClient) {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/authenticate/login" replace />;
    }

    if (!isVerified) {
        return <Navigate to="/authenticate/account-verify" replace />;
    }

    if (Roles && (!role || !Roles.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}

export default Protected