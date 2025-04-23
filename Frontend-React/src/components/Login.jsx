import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from './AuthProvider';


const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidEmail(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Please enter a valid password');
            return;
        }
        // Add your login API endpoint here
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', formData);
            // handle login success, maybe store token or redirect
            // console.log(response.data);
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            setIsLoggedIn(true);
            // console.log('Login Successful!');
            navigate('/');
        } catch (errors) {
            console.log(errors)
            setError(errors.response.data.detail);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-dark" style={{ minHeight: '100vh' }}>
            <div className="bg-light-dark p-5 rounded w-100" style={{ maxWidth: '400px' }}>
                <h3 className="text-light text-center mb-4">Login to Your Account</h3>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-light">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-light">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="d-flex justify-content-end mt-1">
                            <span style={{ cursor: 'pointer' }}>
                                <Link to="/forgot_password/" style={{ color: 'white', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </span>
                        </div>
                    </div>

                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-info" disabled={loading}>
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />&nbsp;Logging In...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                    <div className="d-flex justify-content-center text-light">
                        <p>Don't Have An Account? <Link to={'/register/'} style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Login;
