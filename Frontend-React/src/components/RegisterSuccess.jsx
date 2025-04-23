import React from 'react'
import { useLocation } from 'react-router-dom';
const RegisterSuccess = () => {
    const location = useLocation();
    const email = location.state?.email ? location.state.email : 'to your email address';
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="bg-light-dark p-5 rounded text-center text-light shadow-lg" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4">🎉 Thank You for Registering!</h2>
                <p className="lead">
                    We’ve sent a verification email to <strong>{email}</strong>.
                </p>
                <p className="mb-0">
                    Please check your inbox and follow the link to verify your account.
                </p>
            </div>
        </div>
    )
}

export default RegisterSuccess