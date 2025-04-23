import { useContext } from "react";
import { AuthContext } from "./components/AuthProvider";
import { Navigate } from "react-router-dom";

const isActivateSuccess = ({ children }) => {
    const { hasActivated } = useContext(AuthContext);
    return hasActivated ? children : <Navigate to="/" />;
};

export default isActivateSuccess;