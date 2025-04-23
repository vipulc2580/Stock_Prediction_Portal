import React, { useCallback, useContext } from 'react';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const Header = () => {
    const loginText = 'Login';
    const loginurl = '/login';
    const loginStyle = 'btn btn-outline-info';
    const registerStyle = 'btn btn-info';
    const registerText = 'Register';
    const registerurl = '/register';
    const dashboardText = 'Dashboard';
    const dashboardUrl = '/dashboard/'
    const dashboardStyle = 'btn btn-info'
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const nagivate = useNavigate();
    // console.log(isLoggedIn);
    const handleLogout = (e) => {
        // e.preventDefault();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        nagivate('/login/');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
            <div className="container">
                <Link className="navbar-brand" to="/">Stock Prediction Portal</Link>

                {/* Hamburger toggle */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible content */}
                {isLoggedIn ?
                    (
                        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
                            <div className="d-flex gap-2 mt-3 mt-lg-0">
                                <Button value={{ text: dashboardText, style: dashboardStyle, url: dashboardUrl }} />
                                <button onClick={handleLogout} className='btn btn-danger'>Logout</button>
                            </div>
                        </div>
                    )
                    : (
                        <>
                            <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
                                <div className="d-flex gap-2 mt-3 mt-lg-0">
                                    <Button value={{ text: loginText, style: loginStyle, url: loginurl }} />
                                    <Button value={{ text: registerText, style: registerStyle, url: registerurl }} />
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </nav>
    );
};

export default Header;
