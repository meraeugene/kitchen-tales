import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../types";

const AdminRoute = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" replace />
  );
  return <h1>nigger</h1>;
};

export default AdminRoute;