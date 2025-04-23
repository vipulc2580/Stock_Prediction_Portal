from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework import generics
from .models import User
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework.decorators import api_view
from rest_framework import status
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tasks import send_notification_email

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    permission_classes=(AllowAny,)

    def perform_create(self, serializer):
        serializer.save(request=self.request)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password').strip()
        print(email,password)

        user = authenticate(request, email=email, password=password)
        print(f'User is {user}')
        if user is not None:
            return Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)


class ActivateAccountView(APIView):
    def get(self,request, uidb64, token):
        # print(request,uidb64,token)
        try:
            uid =urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            # print(user,uid,token)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            if not user.is_active:
                user.is_active = True
                user.save()
                return Response({'message': 'Account activated successfully!'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Account is already activated.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def forgot_password(request):
    # print(request)
    # print(request.data.get('email'))
    email=request.data.get('email')
    print(email)
    domain ='localhost:5173'
    # print(domain)
    try:
        user=User.objects.get(email=email)
        # print(user)
        uid =urlsafe_base64_encode(force_bytes(user.pk))
        token =default_token_generator.make_token(user)
        # print(token,uid)
    except User.DoesNotExist:
        user=None
    if user:
        activation_link = f"http://{domain}/reset-password/{uid}/{token}/"
        context={
            'user':user,
            'activation_link':activation_link
        }
        send_notification_email(
            request=request,
            mail_subject='Reset Password For your Account',
            htmlfile='reset_password.html',
            context=context
        )
        return Response({'message':'Email has been sent'},status=status.HTTP_200_OK)
    else:
        return Response({'message':'Invalid'},status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(APIView):
    def get(self,request,uidb64,token):
        try:
            uid=urlsafe_base64_decode(uidb64).decode()
            user=User.objects.get(pk=uid)

            if user and default_token_generator.check_token(user,token):
                return Response({'msesage':'Token is valid'},status=status.HTTP_200_OK)
            else:
                return Response({'message':'Token is Invalid'},status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid link'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self,request,uidb64,token):
        password=request.data.get('password')
        confirm_password=request.data.get('confirm_password')
        # print(password,confirm_password,token,uidb64)
        if not password and not confirm_password:
            return Response({'error': 'Please provide both password fields'}, status=status.HTTP_400_BAD_REQUEST)
        if password!=confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            uid=urlsafe_base64_decode(uidb64).decode()
            user=User.objects.get(pk=uid)
            # print(user)
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.is_active = True  # Optional: If you're activating the account here
                user.save()
                return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid link'}, status=status.HTTP_400_BAD_REQUEST)

class ProtectedView(APIView):
    # this view can be accessed by Logged In User
    permission_classes=[IsAuthenticated]
    def get(self,request):
        response={
            'status':'Request was permitted'
        }
        return Response(response,status=status.HTTP_200_OK)
        