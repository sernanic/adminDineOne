class CategoryDTO:
    def __init__(self, category, categoryImage):
        self.category = category
        self.categoryImage = categoryImage

    def __repr__(self):
        return f"<CategoryDTO category={self.category}, categoryImage={self.categoryImage}>"

    def toDict(self):
        return {
            'categoryId': self.category.categoryId,
            'name': self.category.name,
            'sortOrder': self.category.sortOrder,
            'deleted': self.category.deleted,
            'merchantId': self.category.merchantId,
            'imageUrl': self.categoryImage.imageUrl if self.categoryImage else None
        }
