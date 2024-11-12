from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT, INTEGER

class Reward(db.Model):
    __tablename__ = 'rewards'

    rewardId = db.Column(TEXT, primary_key=True)
    pointsRequired = db.Column(INTEGER, nullable=False)
    name = db.Column(TEXT, nullable=False)
    itemId = db.Column(TEXT, nullable=False)
    description = db.Column(TEXT, nullable=True)
    clientId = db.Column(BIGINT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)

    def __init__(self, rewardId, pointsRequired, name, itemId, description=None, clientId=None, merchantId=None):
        self.rewardId = rewardId
        self.pointsRequired = pointsRequired
        self.name = name
        self.itemId = itemId
        self.description = description
        self.clientId = clientId
        self.merchantId = merchantId

    def __repr__(self):
        return f"<Reward {self.name}>"
