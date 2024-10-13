from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT
from sqlalchemy.sql import func

class ModifierImage(db.Model):
    __tablename__ = 'modifierImages'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    createdAt = db.Column(db.DateTime(timezone=True), server_default=func.now())
    imageUrl = db.Column(TEXT, nullable=False)
    modifierId = db.Column(TEXT, nullable=False)
    clientId = db.Column(BIGINT, nullable=False)

    def __init__(self, imageUrl, modifierId, clientId):
        self.imageUrl = imageUrl
        self.modifierId = modifierId
        self.clientId = clientId

    def __repr__(self):
        return f"<ModifierImage {self.id}>"