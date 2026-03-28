import { type ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute; 