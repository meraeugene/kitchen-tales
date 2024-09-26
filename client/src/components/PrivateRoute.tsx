import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../types";

const PrivateRoute = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
