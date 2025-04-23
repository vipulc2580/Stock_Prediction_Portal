from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone
from datetime import timedelta
import six
import datetime
class CustomTokenGenerator(PasswordResetTokenGenerator):
    """
    Custom token generator with expiration.
    """
    def __init__(self, expiration_time=60*60*24):
        # Default expiration time (in seconds) is 1 day (24 hours)
        self.expiration_time = timedelta(seconds=expiration_time)
        super().__init__()

    def _make_hash_value(self, user, timestamp):
        """
        Override to add custom logic to the token's hash.
        """
        return six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(user.is_active)

    def is_token_expired(self, timestamp):
        """
        Checks if the token has expired based on the custom expiration time.
        """
        token_time = timezone.make_aware(datetime.datetime.fromtimestamp(timestamp))
        expiration_time = timezone.now() - self.expiration_time
        return token_time < expiration_time

# Instantiate the custom token generator with a 24-hour expiration.
custom_token_generator = CustomTokenGenerator(expiration_time=60*60*24)
