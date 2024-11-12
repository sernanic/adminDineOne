from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT, INTEGER, BOOLEAN, TIMESTAMP
from app.models.lineItem import LineItem

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    orderId = db.Column(TEXT, nullable=False, unique=True)
    merchantId = db.Column(TEXT, nullable=False)
    clientId = db.Column(BIGINT, nullable=False)
    employeeId = db.Column(TEXT, nullable=False)
    employeeName = db.Column(TEXT, nullable=False)
    currency = db.Column(TEXT, nullable=False)
    total = db.Column(INTEGER, nullable=False)
    state = db.Column(TEXT, nullable=False)
    taxRemoved = db.Column(BOOLEAN, nullable=False, default=False)
    isVat = db.Column(BOOLEAN, nullable=False, default=False)
    manualTransaction = db.Column(BOOLEAN, nullable=False, default=False)
    groupLineItems = db.Column(BOOLEAN, nullable=False, default=False)
    testMode = db.Column(BOOLEAN, nullable=False, default=False)
    createdTime = db.Column(TIMESTAMP, nullable=False)
    clientCreatedTime = db.Column(TIMESTAMP, nullable=False)
    modifiedTime = db.Column(TIMESTAMP, nullable=False)
    
    # Relationship with LineItems
    lineItems = db.relationship('LineItem', backref='order', lazy=True)

    def __init__(self, orderId, merchantId, clientId, employeeId, employeeName, currency, total, 
                 state, taxRemoved=False, isVat=False, manualTransaction=False,
                 groupLineItems=False, testMode=False, createdTime=None,
                 clientCreatedTime=None, modifiedTime=None):
        self.orderId = orderId
        self.merchantId = merchantId
        self.clientId = clientId
        self.employeeId = employeeId
        self.employeeName = employeeName
        self.currency = currency
        self.total = total
        self.state = state
        self.taxRemoved = taxRemoved
        self.isVat = isVat
        self.manualTransaction = manualTransaction
        self.groupLineItems = groupLineItems
        self.testMode = testMode
        self.createdTime = createdTime
        self.clientCreatedTime = clientCreatedTime
        self.modifiedTime = modifiedTime

    def __repr__(self):
        return f"<Order {self.orderId}>"
