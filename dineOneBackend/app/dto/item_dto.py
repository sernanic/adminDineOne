from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class ItemDTO:
    item_id: str
    merchant_id: str
    hidden: bool
    available: bool
    auto_manage: bool
    name: str
    price: float
    price_type: Optional[str]
    default_tax_rates: bool
    cost: Optional[float]
    is_revenue: bool
    modified_time: datetime
    deleted: bool

    @classmethod
    def from_model(cls, item_model):
        return cls(
            item_id=item_model.item_id,
            merchant_id=item_model.merchant_id,
            hidden=item_model.hidden,
            available=item_model.available,
            auto_manage=item_model.auto_manage,
            name=item_model.name,
            price=float(item_model.price),
            price_type=item_model.price_type,
            default_tax_rates=item_model.default_tax_rates,
            cost=float(item_model.cost) if item_model.cost is not None else None,
            is_revenue=item_model.is_revenue,
            modified_time=item_model.modified_time,
            deleted=item_model.deleted
        )

    def to_dict(self):
        return {
            'item_id': self.item_id,
            'merchant_id': self.merchant_id,
            'hidden': self.hidden,
            'available': self.available,
            'auto_manage': self.auto_manage,
            'name': self.name,
            'price': self.price,
            'price_type': self.price_type,
            'default_tax_rates': self.default_tax_rates,
            'cost': self.cost,
            'is_revenue': self.is_revenue,
            'modified_time': self.modified_time.isoformat() if self.modified_time else None,
            'deleted': self.deleted
        }