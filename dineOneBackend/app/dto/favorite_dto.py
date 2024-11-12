from app.models.favorite import Favorite
from app.models.item import Item

class FavoriteDTO:
    def __init__(self, favorite: Favorite, item: Item):
        self.favorite = favorite
        self.item = item

    def toDict(self):
        return {
            'id': self.favorite.id,
            'itemId': self.favorite.itemId,
            'customerAuthUUID': self.favorite.customerAuthUUID,
            'createdAt': self.favorite.createdAt.isoformat() if self.favorite.createdAt else None,
            'clientId': self.favorite.clientId,
            'item': {
                'itemId': self.item.itemId,
                'merchantId': self.item.merchant_id,
                'name': self.item.name,
                'price': float(self.item.price) if self.item.price else None,
                'priceType': self.item.price_type,
                'hidden': self.item.hidden,
                'available': self.item.available,
                'description': self.item.description,
                'isPopular': self.item.isPopular,
                'deleted': self.item.deleted
            } if self.item else None
        }

    @staticmethod
    def fromFavoriteAndItem(favorite: Favorite, item: Item):
        return FavoriteDTO(favorite, item)

    @staticmethod
    def fromFavoritesAndItems(favorites: list[Favorite], items: list[Item]):
        return [FavoriteDTO(favorite, item) for favorite, item in zip(favorites, items)]
