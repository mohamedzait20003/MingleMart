import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Protected: FC<{ children: ReactNode }> = ({ children }) => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default Protected