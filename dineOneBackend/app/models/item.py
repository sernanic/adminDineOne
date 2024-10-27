from app import db
from sqlalchemy.dialects.postgresql import BIGINT, BOOLEAN, NUMERIC, TEXT, TIMESTAMP
from datetime import datetime
from app.models.itemModifierGroups import ItemModifierGroup

class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    itemId = db.Column(TEXT, nullable=False)
    merchant_id = db.Column(TEXT, nullable=False)  # New column
    hidden = db.Column(BOOLEAN, nullable=False, default=False)
    available = db.Column(BOOLEAN, nullable=False, default=True)
    auto_manage = db.Column(BOOLEAN, nullable=False, default=False)
    name = db.Column(TEXT, nullable=False)
    price = db.Column(NUMERIC, nullable=False)
    price_type = db.Column(TEXT, nullable=True)
    default_tax_rates = db.Column(BOOLEAN, nullable=False, default=False)
    cost = db.Column(NUMERIC, nullable=True)
    is_revenue = db.Column(BOOLEAN, nullable=False, default=False)
    modified_time = db.Column(TIMESTAMP(timezone=True), nullable=False)
    deleted = db.Column(BOOLEAN, nullable=False, default=False)
    clientId = db.Column(BIGINT, nullable=False)
    description = db.Column(TEXT, nullable=True)  # New description field

    categories = db.relationship('Category', secondary='categoryItems', back_populates='items')
    modifierGroups = db.relationship('ItemModifierGroup', back_populates='item')
    

    def __init__(self, itemId, merchant_id, hidden, available, auto_manage, name, price, price_type, 
                 default_tax_rates, cost, is_revenue, modified_time, deleted, clientId, description=None):  # Added description parameter
        self.itemId = itemId
        self.merchant_id = merchant_id  # New parameter
        self.hidden = hidden
        self.available = available
        self.auto_manage = auto_manage
        self.name = name
        self.price = price
        self.price_type = price_type
        self.default_tax_rates = default_tax_rates
        self.cost = cost
        self.is_revenue = is_revenue
        # Convert bigint to datetime
        self.modified_time = datetime.fromtimestamp(modified_time / 1000.0) if isinstance(modified_time, (int, float)) else modified_time
        self.deleted = deleted
        self.clientId = clientId
        self.description = description  # Set description field
    def __repr__(self):
        return f'<Item {self.name}>'
