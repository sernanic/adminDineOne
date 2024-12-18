from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT
from sqlalchemy.sql import func

class CategoryImage(db.Model):
    __tablename__ = 'categoryImages'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    imageURL = db.Column(TEXT, nullable=False)
    categoryId = db.Column(TEXT, nullable=False)
    clientId = db.Column(BIGINT, nullable=False)

    def __init__(self, imageURL, categoryId, clientId):
        self.imageURL = imageURL
        self.categoryId = categoryId
        self.clientId = clientId
    def __repr__(self):
        return f"<CategoryImage {self.id}>"
