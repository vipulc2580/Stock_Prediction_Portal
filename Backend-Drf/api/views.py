from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import StockPredictionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import yfinance as yf
import pandas as pd 
import numpy as np
from datetime import datetime
import matplotlib.pyplot as plt
import os
from django.conf import settings 
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, r2_score
# Create your views here.
class StockPredictionAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker=serializer.validated_data['ticker']
            # print(ticker)

            # Fetch the Data from yfinance
            now=datetime.now()
            start=datetime(now.year-10,now.month,now.day)
            end=now
            df=yf.download(ticker,start,end,auto_adjust=True)
            if df.empty:
                return Response({'message':'Invalid Ticker','info':'No Data found for give Ticker'},status=status.HTTP_404_NOT_FOUND)
            
            df=df.reset_index()
            # print(df)
            # Generate the plot
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close,label='Closing Price')
            plt.title(f'Stock Price of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()

            #  Save the plot to a file
            plt_img_path=f'{ticker}_plot.png'
            image_url=save_plot(plt_img_path)
            # print(image_url)

            # 100 Days moving average
            ma100=df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close,label='Closing Price')
            plt.plot(ma100,'r',label='100 DMA')
            plt.title(f'Stock Price of {ticker},100 DMA')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()

            #  Save the plot to a file
            plt_100_dma=f'{ticker}_100_dma.png'
            plt_100_dma_url=save_plot(plt_100_dma)
            # print(plt_100_dma)


            # 200 Days Moving Average
            ma200=df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close,label='Closing Price')
            plt.plot(ma100,'r',label='100 DMA')
            plt.plot(ma200,'y',label='200 DMA')
            plt.title(f'Stock Price of {ticker},100 DMA,200 DMA')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()

            #  Save the plot to a file
            plt_200_dma=f'{ticker}_200_dma.png'
            plt_200_dma_url=save_plot(plt_200_dma)
            # print(plt_200_dma)

            #Splitting data into Training and Testing DataSets
            data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame(df.Close[int(len(df)*0.7): int(len(df))])

            # Scaling down the data between 0 and 1
            scaler = MinMaxScaler(feature_range=(0,1))

            # Load ML Model
            model = load_model('stock_prediction_model.keras')

            # Preparing Test Data
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.fit_transform(final_df)

            x_test = []
            y_test = []
            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i-100: i])
                y_test.append(input_data[i, 0])
            x_test, y_test = np.array(x_test), np.array(y_test)

            # Making Predictions
            y_predicted = model.predict(x_test)

            # Revert the scaled prices to original price
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1, 1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()

            # Plot the final prediction
            plt.switch_backend('AGG')
            plt.figure(figsize=(12, 5))
            plt.plot(y_test, 'b', label='Original Price')
            plt.plot(y_predicted, 'r', label='Predicted Price')
            plt.title(f'Final Prediction for {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plot_img_path = f'{ticker}_final_prediction.png'
            plot_prediction_url = save_plot(plot_img_path)

            # Model Evaluation
            # Mean Squared Error (MSE)
            mse = mean_squared_error(y_test, y_predicted)

            # Root Mean Squared Error (RMSE)
            rmse = np.sqrt(mse)

            # R-Squared
            r2 = r2_score(y_test, y_predicted)

            context={'message':'Recieved Ticker',
            'plot_url':image_url,
            'plot_ma_100':plt_100_dma_url,
            'plot_ma_200':plt_200_dma_url,
            'plot_predicted':plot_prediction_url,
            'mse':mse,
            'rmse':rmse,
            'r2':r2,
            }
            return Response(context,status=status.HTTP_200_OK)
        else:
            return Response({'message':'Invalid Ticker'},status=status.HTTP_400_BAD_REQUEST)
