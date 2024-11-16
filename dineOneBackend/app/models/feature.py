from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT

class Feature(db.Model):
    __tablename__ = "features"

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    name = db.Column(TEXT, nullable=False)
    imageURL = db.Column(TEXT, nullable=False)
    itemId = db.Column(BIGINT, nullable=True)
    description = db.Column(TEXT, nullable=False)
    clientId = db.Column(BIGINT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)

    def __init__(self, name, imageURL, description, clientId, merchantId, itemId=None):
        self.name = name
        self.imageURL = imageURL
        self.description = description
        self.clientId = clientId
        self.merchantId = merchantId
        self.itemId = itemId

    def __repr__(self):
        return f'<Feature {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'imageURL': self.imageURL,
            'itemId': self.itemId,
            'description': self.description,
            'clientId': self.clientId,
            'merchantId': self.merchantId
        }
