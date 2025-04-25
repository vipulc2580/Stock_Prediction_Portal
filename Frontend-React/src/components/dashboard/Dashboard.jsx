import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosinstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const [ticker, setTicker] = useState('');
    const [loading, setLoading] = useState(false);
    const popularTickers = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'META'];
    const [alert, setAlert] = useState({});
    const [plot, setPlot] = useState('');
    const [ma100, setMA100] = useState('');
    const [ma200, setMA200] = useState('');
    const [finalPrediction, setFinalPrediction] = useState('');
    const [mse, setMSE] = useState();
    const [rmse, setRMSE] = useState();
    const [r2, setR2] = useState();
    const handleChange = (e) => {
        setAlert({});
        setTicker(e.target.value.toUpperCase());
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axiosInstance.post('/predict/', { ticker: ticker })
            console.log(response.data);
            // Set plots
            const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
            const plotUrl = `${backendRoot}${response.data.plot_url}`;
            const ma100Url = `${backendRoot}${response.data.plot_ma_100}`;
            const ma200Url = `${backendRoot}${response.data.plot_ma_200}`;
            const finalPredictionUrl = `${backendRoot}${response.data.plot_predicted}`
            // console.log(plotUrl)
            setPlot(plotUrl);
            setMA100(ma100Url);
            setMA200(ma200Url);
            setFinalPrediction(finalPredictionUrl);
            setMSE(response.data.mse);
            setRMSE(response.data.rmse);
            setR2(response.data.r2);
            console.log(finalPredictionUrl);
        } catch (error) {
            if (error.response.status === 404) {
                setPlot('');
                setMA100('');
                setMA200('');
                setFinalPrediction('');
                setMSE(null);
                setRMSE(null);
                setR2(null);
                setAlert({ 'type': 'danger', 'message': 'Invalid Ticker, No Data Found' });
                console.log(alert.type, alert.message);
            }
            console.log(error.response.data);
        } finally {
            setLoading(false);
        }
    };

    const handlePopularClick = (symbol) => {
        setAlert({});
        setTicker(symbol);
    };


    // useEffect(() => {
    //     // const fetchProtectedData = async () => {
    //     //     try {
    //     //         const response = await axiosInstance.get('/protected-view/');
    //     //         setData(response.data); // Store data if needed
    //     //         // console.log('Protected Data:', response.data);
    //     //     } catch (err) {
    //     //         console.error('Error fetching protected data:', err);
    //     //         setError('Failed to fetch data');
    //     //     }
    //     // };

    //     // fetchProtectedData();
    // }, []);

    return (
        <>
            <div className="container py-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-light">📈 Stock Prediction Dashboard</h2>
                    <p className="text-muted">Get future insights for your favorite stocks</p>
                </div>

                <div className="row justify-content-center mb-4">
                    <div className="col-md-8">
                        <div className="card bg-light-dark p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Stock Ticker (e.g., AAPL)"
                                        value={ticker}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button type="submit" className="btn btn-info" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} spin />&nbsp;Please Wait...
                                            </>
                                        ) : (
                                            'Predict'
                                        )}
                                    </button>
                                </div>
                            </form>
                            {alert.message && (
                                <div className="row justify-content-center mt-3">
                                    <div className="col-md-8">
                                        <div className={`text-${alert.type} text-center`}>
                                            {alert.message}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="text-center mb-3">
                    <h5 className="text-secondary">Or try one of these popular tickers:</h5>
                </div>

                <div className="row justify-content-center">
                    {popularTickers.map((symbol) => (
                        <div key={symbol} className="col-auto mb-2">
                            <button
                                className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                                onClick={() => handlePopularClick(symbol)}
                            >
                                {symbol}
                            </button>
                        </div>
                    ))}
                </div>
                {finalPrediction && (
                    <div className="prediction mt-5">
                        <div className="p-3">
                            {plot && (
                                <img src={plot} alt='stock price' style={{ maxWidth: "100%" }} />
                            )}
                        </div>
                        <div className="p-3">
                            {ma100 && (
                                <img src={ma100} alt='stock price' style={{ maxWidth: "100%" }} />
                            )}
                        </div>
                        <div className="p-3">
                            {ma200 && (
                                <img src={ma200} alt='stock price' style={{ maxWidth: "100%" }} />
                            )}
                        </div>
                        <div className="p-3">
                            {finalPrediction && (
                                <img src={finalPrediction} alt='stock price' style={{ maxWidth: "100%" }} />
                            )}
                        </div>
                        <div className="text-light p-3">
                            <h4>Model Evalulation</h4>
                            <p>Mean Squared Error (MSE): {mse}</p>
                            <p>Root Mean Squared Error (RMSE): {rmse}</p>
                            <p>R-Squared: {r2}</p>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default Dashboard;
