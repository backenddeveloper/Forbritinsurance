import bcrypt
import secrets
import jwt
from os import environ


JWT_ALGORITHM = 'HS256'


def new_signup_code():

    return secrets.token_hex(32)


def get_password_hash(plain_text_password):

    password_hash = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return password_hash.decode('utf-8')


def check_password(plain_text_password, hashed_password):

    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_password.encode('utf-8'))


def encoded_jwt(payload):

    SECRET = environ['JWT_SECRET']

    return jwt.encode(payload, SECRET, algorithm=JWT_ALGORITHM)


def decode_jwt(payload):

    SECRET = environ['JWT_SECRET']

    return jwt.decode(payload, SECRET, algorithms=JWT_ALGORITHM)
