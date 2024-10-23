from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT

class ItemImage(db.Model):
    __tablename__ = 'itemImages'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    itemId = db.Column(TEXT, nullable=False)
    imageURL = db.Column(TEXT, nullable=False)
    clientId = db.Column(BIGINT, nullable=False)

    def __init__(self, itemId, imageURL, clientId):
        self.itemId = itemId
        self.imageURL = imageURL
        self.clientId = clientId

    def __repr__(self):
        return f"<ItemImage {self.id}>"

    def toDict(self):
        return {
            "id": self.id,
            "itemId": self.itemId,
            "imageURL": self.imageURL,
            "clientId": self.clientId
        }
