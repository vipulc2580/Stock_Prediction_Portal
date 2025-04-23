import React from 'react'
import Button from './Button'

const Main = () => {
    const exploreText = 'Explore Now';
    const exploreUrl = '/dashboard/';
    const exploreStyle = 'btn btn-outline-info';
    return (
        <>

            <div className="container get-center">
                <div className='p-5 text-center bg-light-dark rounded'>
                    <h1 className='text-light'>Stock Prediction App</h1>
                    <p className="lead text-light">This stock prediction application utilizes machine learning techniques, specifically employing Keras, and LSTM model, integrated within the Django framework. It forecasts future stock prices by analyzing 100-day and 200-day moving averages, essential indicators widely used by stock analysts to inform trading and investment decisions.</p>
                    <Button value={{ text: exploreText, style: exploreStyle, url: exploreUrl }} />

                </div>
            </div>


        </>
    )
}

export default Main