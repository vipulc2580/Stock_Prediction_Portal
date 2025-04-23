import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
const ActivateAccount = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { setActivated, setRegisterSuccess } = useContext(AuthContext);

    useEffect(() => {
        // Set background to dark theme
        document.body.style.backgroundColor = '#212529';

        const activateUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/activate/${uid}/${token}/`);
                setLoading(false);
                setActivated(false);
                setRegisterSuccess(false);
                await Swal.fire({
                    icon: 'success',
                    title: 'Account Activated 🎉',
                    text: 'Your account has been successfully activated. You can now log in.',
                    confirmButtonText: 'Login Now',
                });
                navigate('/login/');
            } catch (err) {
                setLoading(false);
                await Swal.fire({
                    icon: 'error',
                    title: 'Activation Failed 😞',
                    text: err.response?.data?.error || 'Invalid or expired activation link.',
                    confirmButtonText: 'Try Again Later',
                });
                navigate('/');
            }
        };

        activateUser();

        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [uid, token, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center text-light">
                    <div className="spinner-border text-info" role="status" style={{ width: '4rem', height: '4rem' }}></div>
                    <h4 className="mt-3">Verifying your account, please wait...</h4>
                </div>
            </div>
        );
    }

    return null;
};

export default ActivateAccount;
