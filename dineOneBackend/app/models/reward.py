from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT, INTEGER, BOOLEAN
from sqlalchemy import UniqueConstraint

class Reward(db.Model):
    __tablename__ = 'rewards'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    rewardId = db.Column(TEXT, nullable=False, unique=True)
    rewardName = db.Column(TEXT, nullable=False)
    pointsRequired = db.Column(INTEGER, nullable=False)
    associatedItemId = db.Column(TEXT, nullable=True)
    imageURL = db.Column(TEXT, nullable=True)
    description = db.Column(TEXT, nullable=True)
    clientId = db.Column(BIGINT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)
    deleted = db.Column(BOOLEAN, nullable=False, default=False)

    __table_args__ = (
        UniqueConstraint('clientId', 'merchantId', 'rewardName', name='unique_reward_per_merchant'),
        db.Index('idx_rewards_client_merchant', 'clientId', 'merchantId'),
    )

    def __init__(self, rewardId, rewardName, pointsRequired, clientId, merchantId, associatedItemId=None, imageURL=None, description=None):
        self.rewardId = rewardId
        self.rewardName = rewardName
        self.pointsRequired = pointsRequired
        self.associatedItemId = associatedItemId
        self.imageURL = imageURL
        self.description = description
        self.clientId = clientId
        self.merchantId = merchantId
        self.deleted = False

    def to_dict(self):
        return {
            'id': self.id,
            'rewardId': self.rewardId,
            'rewardName': self.rewardName,
            'pointsRequired': self.pointsRequired,
            'associatedItemId': self.associatedItemId,
            'imageURL': self.imageURL,
            'description': self.description,
            'clientId': self.clientId,
            'merchantId': self.merchantId
        }

    def __repr__(self):
        return f"<Reward {self.rewardName}>"
