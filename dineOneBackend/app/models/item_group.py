from app import db
from sqlalchemy.dialects.postgresql import BIGINT, BOOLEAN, TEXT, TIMESTAMP
from datetime import datetime

class ItemGroup(db.Model):
    __tablename__ = 'ItemGroup'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    itemGroupId = db.Column(TEXT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)
    name = db.Column(TEXT, nullable=False)
    sortOrder = db.Column(BIGINT, nullable=True)
    deleted = db.Column(BOOLEAN, nullable=False, default=False)
    modifiedTime = db.Column(TIMESTAMP(timezone=True), nullable=False)

    def __init__(self, itemGroupId, merchantId, name, sortOrder, deleted, modifiedTime):
        self.itemGroupId = itemGroupId
        self.merchantId = merchantId
        self.name = name
        self.sortOrder = sortOrder
        self.deleted = deleted
        self.modifiedTime = datetime.fromtimestamp(modifiedTime / 1000.0) if isinstance(modifiedTime, (int, float)) else modifiedTime

    def __repr__(self):
        return f'<ItemGroup {self.name}>'