from dataclasses import dataclass

@dataclass
class ModifierDTO:
    modifierId: str
    merchantId: str
    name: str
    available: bool
    price: float
    modifiedTime: str
    modifierGroupId: str
    deleted: bool
    imageUrl: str = None

    @classmethod
    def fromModel(cls, modifierModel, modifierImage=None):
        return cls(
            modifierId=modifierModel.modifierId,
            merchantId=modifierModel.merchantId,
            name=modifierModel.name,
            available=modifierModel.available,
            price=float(modifierModel.price),
            modifiedTime=modifierModel.modifiedTime.isoformat() if modifierModel.modifiedTime else None,
            modifierGroupId=modifierModel.modifierGroupId,
            deleted=modifierModel.deleted,
            imageUrl=modifierImage.imageUrl if modifierImage else None
        )

    def toDict(self):
        return {
            'modifierId': self.modifierId,
            'merchantId': self.merchantId,
            'name': self.name,
            'available': self.available,
            'price': self.price,
            'modifiedTime': self.modifiedTime,
            'modifierGroupId': self.modifierGroupId,
            'deleted': self.deleted,
            'imageUrl': self.imageUrl
        }
