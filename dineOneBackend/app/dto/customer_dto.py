from typing import List
from app.models.favorite import Favorite

class CustomerDTO:
    def __init__(self, customer, favorites: List[Favorite] = None):
        self.customer = customer
        self.favorites = favorites or []

    def __repr__(self):
        return f"<CustomerDTO customer={self.customer}, favorites_count={len(self.favorites)}>"

    def toDict(self):
        return {
            'id': self.customer.id,
            'authUUID': self.customer.authUUID,
            'updatedAt': self.customer.updatedAt.isoformat() if self.customer.updatedAt else None,
            'username': self.customer.username,
            'firstName': self.customer.firstName,
            'lastName': self.customer.lastName,
            'clientId': self.customer.clientId,
            'merchantId': self.customer.merchantId,
            'email': self.customer.email,
            'favorites': [favorite.toDict() for favorite in self.favorites]
        }
