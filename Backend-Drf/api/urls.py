from django.urls import path,include
from accounts import views as UserViews
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views
urlpatterns = [
    # ṛegister View 
    path('register/',UserViews.RegisterView.as_view(),name='register_user'),
    path('activate/<uidb64>/<token>/', UserViews.ActivateAccountView.as_view(), name='activate-account'),
    path('login/',UserViews.LoginView.as_view(),name='login_user'),
    path('forgot_password/',UserViews.forgot_password,name='forgot_password'),
    path('reset_password/<uidb64>/<token>/',UserViews.ResetPasswordView.as_view(),name='reset_password'),
    #jwt token manager
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # protected View
    # path('protected-view/',UserViews.ProtectedView.as_view(),name='protected_view'),
    path('predict/',views.StockPredictionAPIView.as_view(),name='stock_prediction'),
]
