from dataclasses import dataclass, field
from typing import List
from datetime import datetime

@dataclass
class ItemImageDTO:
    id: int
    imageURL: str

@dataclass
class ItemDTO:
    itemModel: object
    images: List[ItemImageDTO] = field(default_factory=list)

    @classmethod
    def fromModel(cls, itemModel, itemImages):
        return cls(
            itemModel=itemModel,
            images=[ItemImageDTO(id=img.id, imageURL=img.imageURL) for img in itemImages]
        )

    def toDict(self):
        return {
            'itemId': self.itemModel.id,
            'merchantId': self.itemModel.merchant_id,
            'hidden': self.itemModel.hidden,
            'available': self.itemModel.available,
            'autoManage': self.itemModel.auto_manage,
            'name': self.itemModel.name,
            'price': float(self.itemModel.price),
            'priceType': self.itemModel.price_type,
            'defaultTaxRates': self.itemModel.default_tax_rates,
            'cost': float(self.itemModel.cost) if self.itemModel.cost is not None else None,
            'isRevenue': self.itemModel.is_revenue,
            'modifiedTime': self.itemModel.modified_time.isoformat() if self.itemModel.modified_time else None,
            'deleted': self.itemModel.deleted,
            'images': [{'id': img.id, 'imageUrl': img.imageURL} for img in self.images]
        }
