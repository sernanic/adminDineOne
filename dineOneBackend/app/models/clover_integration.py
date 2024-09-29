from app import db
from sqlalchemy.dialects.postgresql import BIGINT, TEXT, TIMESTAMP

class CloverIntegration(db.Model):
    __tablename__ = 'cloverIntegration'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    clientId = db.Column(BIGINT, nullable=False, unique=True)
    apiKey = db.Column(TEXT, nullable=False)
    createdAt = db.Column(db.TIMESTAMP(timezone=True), nullable=False, server_default=db.func.now())
    updatedAt = db.Column(db.TIMESTAMP(timezone=True), nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, clientId, apiKey):
        self.clientId = clientId
        self.apiKey = apiKey

    def __repr__(self):
        return f"<CloverIntegration client_id={self.clientId}>"