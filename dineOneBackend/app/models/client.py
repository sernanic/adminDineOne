from app import db
from datetime import datetime
from sqlalchemy.orm import relationship

class Client(db.Model):
    __tablename__ = 'client'

    clientId = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    createdDate = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f'<Client {self.name}>'

    def toDict(self):
        return {
            'clientId': self.clientId,
            'name': self.name,
            'createdDate': self.createdDate.isoformat() if self.createdDate else None,
        }
