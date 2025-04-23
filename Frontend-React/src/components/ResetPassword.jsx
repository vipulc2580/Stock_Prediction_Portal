import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [isTokenValid, setIsTokenValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [passwords, setPasswords] = useState({
        password: '',
        confirm_password: '',
    });

    useEffect(() => {
        const validateToken = async () => {
            try {
                await axios.get(`http://127.0.0.1:8000/api/v1/reset_password/${uid}/${token}/`);
                setIsTokenValid(true);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid or Expired Link',
                    text: 'Please try again by requesting a new password reset link.',
                }).then(() => navigate('/login'));
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [uid, token, navigate]);

    const handleChange = (e) => {
        setAlert(null);
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.password !== passwords.confirm_password) {
            setAlert({ type: 'danger', message: 'Passwords do not match' });
            return;
        }

        try {
            setFormLoading(true);
            await axios.post(`http://127.0.0.1:8000/api/v1/reset_password/${uid}/${token}/`, passwords);
            Swal.fire({
                icon: 'success',
                title: 'Password Reset Successful',
                text: 'You can now login with your new password.',
            }).then(() => navigate('/login'));
        } catch (error) {
            setAlert({
                type: 'danger',
                message: error.response?.data?.error || 'Something went wrong. Please try again.',
            });
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return isTokenValid ? (
        <div className="d-flex justify-content-center align-items-center bg-dark" style={{ minHeight: '100vh' }}>
            <div className="bg-light-dark p-5 rounded w-100" style={{ maxWidth: '400px' }}>
                <h3 className="text-light text-center mb-4">Reset Password</h3>

                {alert && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-light">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={passwords.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirm_password" className="form-label text-light">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirm_password"
                            name="confirm_password"
                            value={passwords.confirm_password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-info" disabled={formLoading}>
                            {formLoading ? 'Updating...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default ResetPassword;
