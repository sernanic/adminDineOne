from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT

class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    header = db.Column(TEXT, nullable=False)
    body = db.Column(TEXT, nullable=False)
    imageUrl = db.Column(TEXT, nullable=True)
    clientId = db.Column(BIGINT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)

    def __init__(self, header, body, clientId, merchantId, imageUrl=None):
        self.header = header
        self.body = body
        self.imageUrl = imageUrl
        self.clientId = clientId
        self.merchantId = merchantId

    def __repr__(self):
        return f'<Notification {self.header}>'

    def to_dict(self):
        return {
            'id': self.id,
            'header': self.header,
            'body': self.body,
            'imageUrl': self.imageUrl,
            'clientId': self.clientId,
            'merchantId': self.merchantId
        }
