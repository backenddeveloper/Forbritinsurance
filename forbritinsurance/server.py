from datetime import timedelta
from datetime import datetime
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi import Response
from fastapi import Body
from fastapi import Depends
from functools import reduce
from os import environ
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import NoResultFound
from starlette.responses import FileResponse
from forbritinsurance.auth import authorisation
from forbritinsurance.crypto import new_signup_code
from forbritinsurance.crypto import get_password_hash
from forbritinsurance.crypto import check_password
from forbritinsurance.crypto import encoded_jwt
from forbritinsurance.database.models import ItemValidation
from forbritinsurance.database.models import ItemModel
from forbritinsurance.database.models import PasswordResetRequestValidation
from forbritinsurance.database.models import PasswordResetUpdateValidation
from forbritinsurance.database.models import PasswordResetModel
from forbritinsurance.database.models import UserLoginValidation
from forbritinsurance.database.models import UserModel
from forbritinsurance.database.models import Base
from forbritinsurance.email import send_password_code


# Create a database pooled session, in a less hackish app this would be polyed off
# DATABASE_URL = "postgresql://username:password@localhost/dbname"
engine = create_engine(environ['DATABASE_URL'])
db = sessionmaker(autocommit=False, autoflush=False, bind=engine)()

# Create the main app
app = FastAPI()


# The beginning of the auth workflow
@app.post('/api/password/reset')
async def create_password_reset(item: PasswordResetRequestValidation = Body(...)):

    # Rate limiting because this will be on the internet
    last_entry = db.query(PasswordResetModel).order_by(PasswordResetModel.created.desc()).first()
    if last_entry and datetime.utcnow() - last_entry.created < timedelta(seconds=10):
        raise HTTPException(status_code=429, detail="We only allow one signup every 10 seconds")
    # End rate limiting segment

    # If reset exists, update the password
    try:
        model = db.query(PasswordResetModel).filter(PasswordResetModel.email == item.email).one()
    except NoResultFound:
        model = PasswordResetModel()
        model.email = item.email

    model.signupcode = new_signup_code()
    model.created = datetime.utcnow()
    db.add(model)
    db.commit()
    send_password_code(model.email, model.signupcode)
    return {'success': True}


@app.post('/api/password/update')
async def update_password(item: PasswordResetUpdateValidation = Body(...)):

    try:
        reset = db.query(PasswordResetModel).filter(PasswordResetModel.signupcode == item.signupcode).one()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Invalid signup code supplied")

    # For simplicity, user creation and password reset are consolidated
    try:
        model = db.query(UserModel).filter(UserModel.email == reset.email).one()
    except NoResultFound:
        model = UserModel()
        model.email = reset.email

    model.password = get_password_hash(item.password.get_secret_value())
    db.add(model)
    db.delete(reset)
    db.commit()
    return {'success': True}


@app.post('/api/login')
async def login(response: Response, item: UserLoginValidation = Body(...)):

    # No user found
    try:
        user = db.query(UserModel).filter(UserModel.email == item.email).one()
    except NoResultFound:
        raise HTTPException(status_code=403, detail="Invalid login credentials")

    # Invalid password
    if not check_password(item.password.get_secret_value(), user.password):
        raise HTTPException(status_code=403, detail="Invalid login credentials")

    return {'JWT': encoded_jwt({'email': user.email, 'id': user.id})}


# The beginning of the items workflow
@app.get("/api/items")
async def list_items(user: str = Depends(authorisation)):

    # Return all items for a given user
    return db.query(ItemModel).filter(ItemModel.user == user).all()


@app.get("/api/items/total")
async def total_items(user: str = Depends(authorisation)):

    # Return the accumulated value for a user
    items = db.query(ItemModel).filter(ItemModel.user == user).all()
    return {'count': len(items), 'total': sum([item.price for item in items])}


@app.post("/api/items/create")
async def create_item(item: ItemValidation = Body(...), user: str = Depends(authorisation)):

    # prices are in £
    db_item = ItemModel(**item.dict(), user=user)
    db.add(db_item)
    db.commit()
    return {'success': True}


# The beginning of the frontend app section
# Catch-all route to serve react/build/index.html if no specific file is found
# StaticFiles doesn't allow a default to be set, which prevents react router
# from firing. Quick and dirty app, normally SPAs go on a CDN
@app.get("/{path:path}")
def serve_index(path: str):

    static_directory = Path("react/build")
    file_path = static_directory / path

    if not file_path.exists() or not file_path.is_file():
        file_path = "react/build/index.html"

    return FileResponse(str(file_path))


# Because this is a quick and dirty app we are not
# going to set up proper Alembic migrations, this
# just creates the database schema if it is absent
Base.metadata.create_all(bind=engine)
