from app import db
from sqlalchemy.dialects.postgresql import BIGINT

class Integration(db.Model):
    __tablename__ = 'integrations'

    id = db.Column(BIGINT, primary_key=True, autoincrement=True)
    clientId = db.Column(BIGINT, unique=True, nullable=False)
    integrationTypeId = db.Column(BIGINT, nullable=False)

    def __init__(self, clientId, integrationTypeId):
        self.clientId = clientId
        self.integrationTypeId = integrationTypeId

    def __repr__(self):
        return f"<Integration {self.clientId}>"