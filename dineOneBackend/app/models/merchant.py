from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT
from datetime import datetime

class Merchant(db.Model):
    __tablename__ = 'merchants'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    merchantId = db.Column(TEXT, nullable=False, unique=True, index=True)
    name = db.Column(TEXT, nullable=False)
    address = db.Column(TEXT, nullable=True)
    city = db.Column(TEXT, nullable=True)
    state = db.Column(TEXT, nullable=True)
    clientId = db.Column(BIGINT, nullable=False)
    imageUrl = db.Column(TEXT, nullable=True)

    def __init__(self, merchantId, name, address, city, state, clientId, imageUrl=None):
        self.merchantId = merchantId
        self.name = name
        self.address = address
        self.city = city
        self.state = state
        self.clientId = clientId
        self.imageUrl = imageUrl

    def __repr__(self):
        return f'<Merchant {self.name}>'
