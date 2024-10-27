from typing import List
from .item_dto import ItemDTO

class CategoryDTO:
    def __init__(self, category, categoryImage, items: List[ItemDTO] = None):
        self.category = category
        self.categoryImage = categoryImage
        self.items = items or []

    def __repr__(self):
        return f"<CategoryDTO category={self.category}, categoryImage={self.categoryImage}, items_count={len(self.items)}>"

    def toDict(self):
        return {
            'categoryId': self.category.categoryId,
            'name': self.category.name,
            'sortOrder': self.category.sortOrder,
            'deleted': self.category.deleted,
            'merchantId': self.category.merchantId,
            'imageUrl': self.categoryImage.imageURL if self.categoryImage else None,
            'items': [item.toDict() for item in self.items]
        }
