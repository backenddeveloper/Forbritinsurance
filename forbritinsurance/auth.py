from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from forbritinsurance.crypto import decode_jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def authorisation(token: str = Depends(oauth2_scheme)):

    try:
        return decode_jwt(token)['id']

    except Exception as e:

        # TODO: log properly
        print('Caught an authorisation error')
        print(e)
        raise HTTPException(status_code=401,
                            detail="Invalid credentials",
                            headers={"WWW-Authenticate": "Bearer"})
