from decimal import Decimal
from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import SecretStr
from pydantic import constr
from pydantic import Field
from pydantic import field_validator
from typing import Annotated
from datetime import datetime
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class ItemValidation(BaseModel):
    name: constr(pattern='^[a-zA-Z0-9]+$')
    price: Annotated[Decimal, Field(max_digits=10, decimal_places=2, ge=0.01, le=9999999999)]


class ItemModel(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(Integer, ForeignKey('users.id'), index=True)
    name = Column(String, index=True)
    price = Column(Float(asdecimal=True))


class UserLoginValidation(BaseModel):
    email: EmailStr
    password: SecretStr


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)


class PasswordResetRequestValidation(BaseModel):
    email: EmailStr


class PasswordResetUpdateValidation(BaseModel):
    signupcode: constr(pattern='^[a-fA-F0-9]{64}')
    password: SecretStr
    confirmation: SecretStr

    @field_validator("confirmation")
    def check_string_equality(cls, confirmation, values):
        if confirmation != values.data['password']:
            raise ValueError("Strings must be equal")
        return confirmation


class PasswordResetModel(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    signupcode = Column(String)
    created = Column(DateTime, default=datetime.utcnow)
