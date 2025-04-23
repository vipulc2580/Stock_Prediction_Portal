from celery import shared_task
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings
from accounts.models import User

@shared_task
def send_notification_email(request,mail_subject,htmlfile,context):
    from_email = settings.DEFAULT_FROM_EMAIL

    message = render_to_string(f'accounts/emails/{htmlfile}', context)

    # print("DEBUG: Rendered Email Content:\n", message)  # Debugging line
    # print('DEBUG ',current_site)
    to_email = context.get('user').email
    mail = EmailMessage(mail_subject, message, from_email, to=[to_email])
    mail.content_subtype = "html"  # Ensures email is sent as HTML
    mail.send()