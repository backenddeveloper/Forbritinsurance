from os import environ
import yagmail


def send_password_code(destination, code):
    username = environ['EMAIL_ADDRESS']
    password = environ['EMAIL_PASSWORD']
    url = environ['APP_URL']
    subject = 'Forbritinsurance Password Reset Request'
    content = f'''
A password reset was requested for this email.

Please note, this application is just a demo for a tech test; if you were not expecting this email please ignore it!

Alternatively please use the following link to reset your password:

<a href="{url}/password/update/{code}">{url}/password/update/{code}</a>
'''

    yagmail.SMTP(user=username, password=password).send(to=destination, subject=subject, contents=content)
