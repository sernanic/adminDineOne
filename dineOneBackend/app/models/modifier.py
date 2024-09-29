from app import db
from sqlalchemy.dialects.postgresql import BIGINT, BOOLEAN, NUMERIC, TEXT, TIMESTAMP
from datetime import datetime

class Modifier(db.Model):
    __tablename__ = 'modifiers'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    modifierId = db.Column(TEXT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)
    name = db.Column(TEXT, nullable=False)
    available = db.Column(BOOLEAN, nullable=False, default=True)
    price = db.Column(NUMERIC, nullable=False)
    modifiedTime = db.Column(TIMESTAMP(timezone=True), nullable=False)
    modifierGroupId = db.Column(TEXT, nullable=False)
    deleted = db.Column(BOOLEAN, nullable=False, default=False)

    def __init__(self, modifierId, merchantId, name, available, price, modifiedTime, modifierGroupId, deleted):
        self.modifierId = modifierId
        self.merchantId = merchantId
        self.name = name
        self.available = available
        self.price = price
        # Convert bigint to datetime
        self.modifiedTime = datetime.fromtimestamp(modifiedTime / 1000.0) if isinstance(modifiedTime, (int, float)) else modifiedTime
        self.modifierGroupId = modifierGroupId
        self.deleted = deleted

    def __repr__(self):
        return f'<Modifier {self.name}>'
