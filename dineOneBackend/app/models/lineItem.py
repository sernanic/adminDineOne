from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT, INTEGER, BOOLEAN, TIMESTAMP

class LineItem(db.Model):
    __tablename__ = 'lineItems'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    lineItemId = db.Column(TEXT, nullable=False, unique=True)
    orderId = db.Column(BIGINT, db.ForeignKey('orders.orderId'), nullable=False)
    itemId = db.Column(TEXT, nullable=True)  # Can be null if custom item
    name = db.Column(TEXT, nullable=False)
    price = db.Column(INTEGER, nullable=False)
    note = db.Column(TEXT, nullable=True)
    printed = db.Column(BOOLEAN, nullable=False, default=False)
    createdTime = db.Column(TIMESTAMP, nullable=False)
    orderClientCreatedTime = db.Column(TIMESTAMP, nullable=False)
    exchanged = db.Column(BOOLEAN, nullable=False, default=False)
    refunded = db.Column(BOOLEAN, nullable=False, default=False)
    isRevenue = db.Column(BOOLEAN, nullable=False, default=True)
    isOrderFee = db.Column(BOOLEAN, nullable=False, default=False)
    clientId = db.Column(BIGINT, nullable=False)
    merchantId = db.Column(TEXT, nullable=False)

    def __init__(self, lineItemId, orderId, name, price, clientId, itemId=None, note=None,
                 printed=False, createdTime=None, orderClientCreatedTime=None,
                 exchanged=False, refunded=False, isRevenue=True, isOrderFee=False, merchantId=None):
        self.lineItemId = lineItemId
        self.orderId = orderId
        self.itemId = itemId
        self.name = name
        self.price = price
        self.note = note
        self.printed = printed
        self.createdTime = createdTime
        self.orderClientCreatedTime = orderClientCreatedTime
        self.exchanged = exchanged
        self.refunded = refunded
        self.isRevenue = isRevenue
        self.isOrderFee = isOrderFee
        self.clientId = clientId
        self.merchantId = merchantId
    def __repr__(self):
        return f"<LineItem {self.lineItemId}>" 