from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'

    userId = db.Column(db.Integer, primary_key=True)
    clientId = db.Column(db.Integer, nullable=False)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    isAdmin = db.Column(db.Boolean, default=False)
    createdDate = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    modifiedDate = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    uid = db.Column(db.String(255), nullable=False)

    def __init__(self, firstName, lastName, clientId, isAdmin=False, uid=None):
        self.firstName = firstName
        self.lastName = lastName
        self.clientId = clientId
        self.isAdmin = isAdmin
        self.uid = uid

    def __repr__(self):
        return f'<User {self.firstName} {self.lastName}>'

    def toDict(self):
        return {
            'userId': self.userId,
            'clientId': self.clientId,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'isAdmin': self.isAdmin,
            'createdDate': self.createdDate.isoformat() if self.createdDate else None,
            'modifiedDate': self.modifiedDate.isoformat() if self.modifiedDate else None,
            'uid': self.uid
        }
