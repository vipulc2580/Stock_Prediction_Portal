import { useContext } from "react";
import { AuthContext } from "./components/AuthProvider";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    return !isLoggedIn ? children : <Navigate to="/dashboard/" />;
};

export default PrivateRoutes;