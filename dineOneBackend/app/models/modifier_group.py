from app import db
from sqlalchemy.dialects.postgresql import BIGINT, BOOLEAN, TEXT, INTEGER

class ModifierGroup(db.Model):
    __tablename__ = 'modifierGroup'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    modifierGroupId = db.Column(TEXT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)
    name = db.Column(TEXT, nullable=False)
    showByDefault = db.Column(BOOLEAN, nullable=False, default=False)
    sortOrder = db.Column(INTEGER, nullable=False, default=0)
    deleted = db.Column(BOOLEAN, nullable=False, default=False)
    clientId = db.Column(BIGINT, nullable=False)

    def __init__(self, modifierGroupId, merchantId, name, showByDefault, sortOrder, deleted, clientId):
        self.modifierGroupId = modifierGroupId
        self.merchantId = merchantId
        self.name = name
        self.showByDefault = showByDefault
        self.sortOrder = sortOrder
        self.deleted = deleted
        self.clientId = clientId
    def __repr__(self):
        return f'<ModifierGroup {self.name}>'
