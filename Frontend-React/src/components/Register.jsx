import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from "./AuthProvider";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        username: '',
        password: '',
        confirm_password: ''
    });

    const { setActivated, setRegisterSuccess } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setMessage({ type: '', text: "" });
        setErrors({});
    };
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(formData.email)) {
            setAlert({ type: 'danger', message: 'Please enter a valid email address.' });
            return;
        }

        if (formData.password !== formData.confirm_password) {
            setMessage({ type: 'danger', text: 'Passwords do not match' });
            return;
        }
        try {
            setLoading(true);
            setErrors({});
            setMessage({ type: '', text: '' });
            // console.log(formData);
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', formData);
            // console.log(response);
            setActivated(true);
            setRegisterSuccess(true);
            // console.log(response.data);
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                phone_number: '',
                password: '',
                confirm_password: ''
            });
            console.log(response.status);
            console.log(response.statusText);
            setMessage({ type: 'success', text: 'Registered successfully!' });
            navigate('/register/success', {
                state: { email: formData.email }
            });
        } catch (error) {
            // console.log('Error Occured');
            console.log(error);
            // console.log(error.response.data);
            setErrors(error.response.data);
            setLoading(false);
            if (error.status == 500) setMessage({ type: 'danger', text: 'Server not responding' });
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow bg-dark text-light rounded-4 p-4">
                        <h3 className="text-center mb-4">Create an Account</h3>

                        {alert && (
                            <div className={`alert alert-${message.type}`} role="alert">
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="form-control" required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="form-control" required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
                                <small>{errors.username && <div className="text-danger">{errors.username}</div>}</small>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                                <small>{errors.email && <div className="text-danger">{errors.email}</div>}</small>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Phone Number</label>
                                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="form-control" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
                                <small>{errors.password && <div className="text-danger">{errors.password}</div>}</small>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="form-control" required />
                            </div>

                            <div className="d-flex justify-content-center mb-3">
                                <button type="submit" className="btn btn-info" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin />&nbsp;Please Wait...
                                        </>
                                    ) : (
                                        'Register'
                                    )}
                                </button>

                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <p className="text-light">Already Have An Account? <Link to={'/login/'} style={{ color: 'white', textDecoration: 'none' }}>Log In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register