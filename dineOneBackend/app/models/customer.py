from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT, TIMESTAMP
from app.models.favorite import Favorite

class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    authUUID = db.Column(TEXT, nullable=False, unique=True)
    updatedAt = db.Column(TIMESTAMP, nullable=False)
    username = db.Column(TEXT, nullable=True)
    firstName = db.Column(TEXT, nullable=True)
    lastName = db.Column(TEXT, nullable=True)
    clientId = db.Column(BIGINT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)
    email = db.Column(TEXT, nullable=False)

    def __init__(self, authUUID, updatedAt, username, firstName, lastName, clientId, merchantId, email):
        self.authUUID = authUUID
        self.updatedAt = updatedAt
        self.username = username
        self.firstName = firstName
        self.lastName = lastName
        self.clientId = clientId
        self.merchantId = merchantId
        self.email = email
    def __repr__(self):
        return f"<Customer {self.username}>"

    def toDict(self):
        return {
            'id': self.id,
            'authUUID': self.authUUID,
            'updatedAt': self.updatedAt.isoformat() if self.updatedAt else None,
            'username': self.username,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'clientId': self.clientId,
            'merchantId': self.merchantId,
            'email': self.email,
            'favoriteItems': [item.itemId for item in self.favoriteItems.all()] if self.favoriteItems else [],
            'email': self.email
        }

