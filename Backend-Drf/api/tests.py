from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
import sys
import os

# Add parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Now you can import from accounts
from accounts.models import User
uid=urlsafe_base64_decode('MTA').decode()  # Expected to print '10
token='coogc6-89ba1d804c4d37fa9a8d57be54cf194f'
try:
    user=User.objects.get(pk=uid)
    print(user)
    if user and default_token_generator.check_token(user,token):
        print('Valid token')
    else:
        print('Invalid Token') 
except:
    pass
