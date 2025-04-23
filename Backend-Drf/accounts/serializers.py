from rest_framework import serializers
from .models import User 
from .tasks import send_notification_email
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.sites.shortcuts import get_current_site
import json

class UserSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,min_length=8,style={'input-type':'password'})
    class Meta:
        model=User
        fields=['first_name','last_name','username','email','phone_number','password']
    
    def create(self,validated_data, **kwargs):
        request = kwargs.get('request')
        # print(request)
        domain = request.get_host() if request else 'localhost:5173'
        # print(domain)
        username=validated_data['username']
        first_name=validated_data['first_name']
        last_name=validated_data['last_name']
        email=validated_data['email']
        phone_number=validated_data['phone_number']
        password=validated_data['password']
        user=User.objects.create(username=username,first_name=first_name,last_name=last_name,email=email,phone_number=phone_number)
        user.set_password(password)
        user.save()
        # print(user)
        uid =urlsafe_base64_encode(force_bytes(user.pk))
        token =default_token_generator.make_token(user)
        # print(token)
        activation_link = f"http://{domain}/activate/{uid}/{token}/"
        context = {
        'user': user,
        'activation_link': activation_link,
        }
        send_notification_email(
                request=request,
                mail_subject='Please activate your account!',
                htmlfile='account_verification.html',
                context=context)
        return user