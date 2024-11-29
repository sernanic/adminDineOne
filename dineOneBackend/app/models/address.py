from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT, FLOAT

class Address(db.Model):
    __tablename__ = 'addresses'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    merchantId = db.Column(TEXT, nullable=False)
    clientId = db.Column(BIGINT, nullable=False)
    address = db.Column(TEXT, nullable=False)
    city = db.Column(TEXT, nullable=False)
    state = db.Column(TEXT, nullable=False)
    country = db.Column(TEXT, nullable=False)
    postal_code = db.Column(TEXT, nullable=False)
    latitude = db.Column(FLOAT, nullable=False)
    longitude = db.Column(FLOAT, nullable=False)

    def __init__(self, address, city, state, country, postal_code, latitude, longitude, merchant_id, client_id):
        self.address = address
        self.city = city
        self.state = state
        self.country = country
        self.postal_code = postal_code
        self.latitude = latitude
        self.longitude = longitude
        self.merchantId = merchant_id
        self.clientId = client_id

    def __repr__(self):
        return f'<Address {self.address}, {self.city}>'

    def get_coordinates(self):
        return {
            'latitude': self.latitude,
            'longitude': self.longitude
        }

    def get_location(self):
        return {
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'postalCode': self.postal_code,
            'merchantId': self.merchantId,
            'clientId': self.clientId,
            'coordinates': self.get_coordinates()
        }

    def to_dict(self):
        location = self.get_location()
        return {
            **location,
            'coordinates': self.get_coordinates()
        }
