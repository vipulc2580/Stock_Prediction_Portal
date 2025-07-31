# Stock Prediction Portal

A full-stack stock prediction application built with Django REST Framework, React.js, and an LSTM-based deep learning model. The portal fetches historical stock data, performs time series forecasting using LSTM, and presents predictions through an interactive web interface.

## Features

- Search and select stock symbols (e.g., AAPL, TSLA, INFY)
- Fetch historical price data using `yfinance`
- Calculate and plot 100-day and 200-day moving averages
- Train and run LSTM-based stock prediction model
- Display original vs. predicted prices with interactive charts
- Clean separation of backend (API & ML logic) and frontend (UI)

## Tech Stack

**Frontend**  
- React.js  
- Axios  
- Chart.js  

**Backend**  
- Django  
- Django REST Framework  
- yfinance  

**Machine Learning**  
- Python  
- TensorFlow / Keras  
- Scikit-learn  
- NumPy / Pandas  


## Workflow

1. User selects or enters a stock symbol from the React UI.
2. Backend fetches the stock's historical data using `yfinance`.
3. Data is preprocessed and moving averages are calculated.
4. The LSTM model is trained (or loaded if pre-trained).
5. Model predictions are returned via the API.
6. React visualizes both historical and predicted data in graphs.

## Getting Started

### Backend Setup (Django)

```bash
cd backend
python -m venv env
source env/bin/activate           # Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

## Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

### API Endpoints
 - GET /api/stock/<symbol>/data/ — Fetch historical stock data
 - POST /api/stock/predict/ — Train model and return predictions

#### Ticker Examples

You can use the following ticker symbols for testing:

1. `AAPL` (Apple Inc.)  
2. `MSFT` (Microsoft)  
3. `TSLA` (Tesla Inc.)  
4. `INFY.NS` (Infosys Ltd - NSE India)  
5. `AMZN` (Amazon)

---

#### Limitations

1. The model is trained only on past price data (no external features such as news sentiment or volume).  
2. Accuracy is measured on hold-out test data, not real-time forecasting.  
3. Not intended for live financial trading or investment decisions.

## Conclusion

The Stock Prediction Portal demonstrates how deep learning models, specifically LSTM networks, can be integrated into a full-stack web application for time series forecasting. While the application showcases key concepts in financial data analysis, model training, and API-driven architecture, it serves primarily as a proof of concept.

Future enhancements could include:

- Incorporating external features such as trading volume, technical indicators, or news sentiment.
- Expanding the forecasting window to predict future prices, not just evaluate on historical test data.
- Deploying the application to a cloud environment with automated CI/CD pipelines.
- Adding user authentication and personalized watchlists for a more production-ready experience.

This project is intended for educational and experimental purposes, and should not be used for financial decision-making without further validation and enhancement.

