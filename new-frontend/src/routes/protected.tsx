import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store";

const Protected: FC<{ children: ReactNode, Roles?: string[] }> = ({ children, Roles }) => {
    const { isAuthenticated, isVerified, role } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
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