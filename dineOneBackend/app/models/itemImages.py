from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT

class ItemImage(db.Model):
    __tablename__ = 'itemImages'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    itemId = db.Column(TEXT, nullable=False)
    imageURL = db.Column(TEXT, nullable=False)

    def __init__(self, itemId, imageURL):
        self.itemId = itemId
        self.imageURL = imageURL

    def __repr__(self):
        return f"<ItemImage {self.id}>"