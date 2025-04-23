import { useContext } from "react";
import { AuthContext } from "./components/AuthProvider";
import { Navigate } from "react-router-dom";

const IsRegisterSuccess = ({ children }) => {
    const { registerSuccess } = useContext(AuthContext);
    return registerSuccess ? children : <Navigate to="/" />;
};

export default IsRegisterSuccess;