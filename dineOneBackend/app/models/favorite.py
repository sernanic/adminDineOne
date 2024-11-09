from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT, TIMESTAMP
from datetime import datetime

class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    itemId = db.Column(TEXT, db.ForeignKey('items.itemId'), nullable=False)
    customerAuthUUID = db.Column(TEXT, db.ForeignKey('customers.authUUID'), nullable=False)
    createdAt = db.Column(TIMESTAMP(timezone=True), nullable=False, default=datetime.utcnow)
    clientId = db.Column(BIGINT, nullable=False)
    # Relationships
    item = db.relationship('Item', backref=db.backref('favorites', lazy=True))
    customer = db.relationship('Customer', backref=db.backref('favorites', lazy=True))

    def __init__(self, itemId, customerAuthUUID, clientId):
        self.itemId = itemId
        self.customerAuthUUID = customerAuthUUID
        self.clientId = clientId

    def __repr__(self):
        return f'<Favorite {self.id}>'

    def toDict(self):
        return {
            'id': self.id,
            'itemId': self.itemId,
            'customerAuthUUID': self.customerAuthUUID,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'clientId': self.clientId,
        } 