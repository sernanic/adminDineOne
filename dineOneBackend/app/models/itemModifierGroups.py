from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT

class ItemModifierGroup(db.Model):
    __tablename__ = 'itemModifierGroups'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    itemId = db.Column(TEXT, db.ForeignKey('items.itemId'), nullable=False)
    modifierGroupId = db.Column(TEXT, db.ForeignKey('modifierGroup.modifierGroupId'), nullable=False)
    clientId = db.Column(BIGINT, nullable=False)

    # Define relationships
    item = db.relationship('Item', back_populates='modifierGroups')
    modifierGroup = db.relationship('ModifierGroup', back_populates='items')

    def __init__(self, itemId, modifierGroupId, clientId):
        self.itemId = itemId
        self.modifierGroupId = modifierGroupId
        self.clientId = clientId

    def __repr__(self):
        return f'<ItemModifierGroup {self.id}>'

    def toDict(self):
        return {
            'id': self.id,
            'itemId': self.itemId,
            'modifierGroupId': self.modifierGroupId,
            'clientId': self.clientId
        }