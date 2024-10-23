from app import db
from sqlalchemy.dialects.postgresql import BIGINT, BOOLEAN, TEXT, INTEGER
from .categoryItem import CategoryItem

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    categoryId = db.Column(TEXT, nullable=False, unique=True)
    merchantId = db.Column(TEXT, nullable=False)
    name = db.Column(TEXT, nullable=False)
    sortOrder = db.Column(INTEGER, nullable=True)
    deleted = db.Column(BOOLEAN, nullable=False, default=False)
    clientId = db.Column(BIGINT, nullable=False)

    items = db.relationship('Item', secondary='categoryItems', back_populates='categories')

    def __init__(self, categoryId, merchantId, name, sortOrder=None, deleted=False, clientId=None):
        self.categoryId = categoryId
        self.merchantId = merchantId
        self.name = name
        self.sortOrder = sortOrder
        self.deleted = deleted
        self.clientId = clientId
    def __repr__(self):
        return f"<Category {self.name}>"
