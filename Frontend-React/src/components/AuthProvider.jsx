import { createContext, useState, useEffect } from "react";
import ActivateAccount from "./ActivateAccount";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('accessToken')
    );
    const [hasActivated, setActivated] = useState(
        localStorage.getItem("activateSuccess") === "true"
    );
    const [registerSuccess, setRegisterSuccess] = useState(
        localStorage.getItem("registerSuccess") === "true"
    );
    useEffect(() => {
        if (registerSuccess) {
            localStorage.setItem("registerSuccess", "true");
        } else {
            localStorage.removeItem("registerSuccess");
        }

        if (hasActivated) {
            localStorage.setItem("activateSuccess", "true");
        } else {
            localStorage.removeItem("activateSuccess");
        }
    }, [registerSuccess, hasActivated]);

    // console.log(isLoggedIn);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, hasActivated, setActivated, registerSuccess, setRegisterSuccess }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext };
