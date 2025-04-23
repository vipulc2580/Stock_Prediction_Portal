import React, { useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        setAlert({});
        setEmail(e.target.value);
    };
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            setAlert({ type: 'danger', message: 'Enter a valid email Address' });
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/v1/forgot_password/', { email });
            setEmail('');
            console.log(response.data);
            setAlert({ type: 'success', message: 'Password reset email sent!' });
        } catch (error) {
            console.log(error);
            setAlert({ type: 'danger', message: error.response?.data?.message || 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-dark" style={{ minHeight: '100vh' }}>
            <div className="bg-light-dark p-5 rounded w-100" style={{ maxWidth: '400px' }}>
                <h3 className="text-light text-center mb-4">Forgot Password</h3>

                {alert && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-light">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-info" disabled={loading}>
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />&nbsp;Logging In...
                                </>
                            ) : (
                                'Send Email'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword