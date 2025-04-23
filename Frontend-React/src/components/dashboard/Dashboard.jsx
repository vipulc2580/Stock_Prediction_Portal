import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosinstance';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axiosInstance.get('/protected-view/');
                setData(response.data); // Store data if needed
                // console.log('Protected Data:', response.data);
            } catch (err) {
                console.error('Error fetching protected data:', err);
                setError('Failed to fetch data');
            }
        };

        fetchProtectedData();
    }, []);

    return (
        <div className="text-light container">
            <h1>Dashboard</h1>
            {error && <p className="text-danger">{error}</p>}
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default Dashboard;
