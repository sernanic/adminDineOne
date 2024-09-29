from app import db
from sqlalchemy.dialects.postgresql import BIGINT, BOOLEAN, TEXT, INTEGER

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    categoryId = db.Column(TEXT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)
    name = db.Column(TEXT, nullable=False)
    sortOrder = db.Column(INTEGER, nullable=True)
    deleted = db.Column(BOOLEAN, nullable=False, default=False)

    def __init__(self, categoryId, merchantId, name, sortOrder=None, deleted=False):
        self.categoryId = categoryId
        self.merchantId = merchantId
        self.name = name
        self.sortOrder = sortOrder
        self.deleted = deleted

    def __repr__(self):
        return f"<Category {self.name}>"
