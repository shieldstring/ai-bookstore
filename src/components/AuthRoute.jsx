import React from "react";
import { useSelector } from "react-redux";
import { Navigate} from "react-router-dom";

function AuthRoute({ children }) {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? children : <Navigate to="/login" replace />;
}

export default AuthRoute;
