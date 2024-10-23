from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT

class CategoryItem(db.Model):
    __tablename__ = 'categoryItems'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    categoryId = db.Column(TEXT, db.ForeignKey('categories.categoryId'), nullable=False)
    itemId = db.Column(TEXT, db.ForeignKey('items.itemId'), nullable=False)
    clientId = db.Column(BIGINT, nullable=False)

    def __init__(self, categoryId, itemId, clientId):
        self.categoryId = categoryId
        self.itemId = itemId
        self.clientId = clientId

    def __repr__(self):
        return f"<CategoryItem categoryId={self.categoryId} itemId={self.itemId}>"
