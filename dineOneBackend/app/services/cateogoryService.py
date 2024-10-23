import requests
from flask import current_app
from app.services.supabase_service import SupabaseService
from app.dto.category_dto import CategoryDTO
from app.dto.item_dto import ItemDTO

class CategoryService:
    @staticmethod
    def getCategoriesByMerchantId(merchantId, clientId):
        categories = SupabaseService.getCategoriesByMerchantId(merchantId, clientId)
        return [CategoryService.getCategoryDTOByCategoryId(category.categoryId, merchantId, clientId) for category in categories]

    @staticmethod
    def getCategoryDTOByCategoryId(categoryId, merchantId, clientId):
        """
        Retrieve a CategoryDTO containing the category, its associated images, and items.

        :param categoryId: The ID of the category
        :param merchantId: The ID of the merchant
        :param clientId: The ID of the client
        :return: A CategoryDTO object or None if not found
        """
        try:
            category = SupabaseService.getPublicCategoryById(merchantId, categoryId)
            if not category:
                return None

            categoryImage = SupabaseService.getCategoryImageByCategoryId(categoryId)
            # Fetch items associated with this category
            categoryItems = SupabaseService.getCategoryItemsByCategoryId(merchantId,categoryId, clientId)
            items = []
            for categoryItem in categoryItems:
                item = SupabaseService.getItemById(merchantId, categoryItem.itemId, clientId)
                if item:
                    itemImages = SupabaseService.getItemImagesByItemId(item.itemId, clientId)
                    for itemImage in itemImages:
                        print("itemImage", itemImage)
                    itemDTO = ItemDTO.fromModel(item, itemImages)
                    items.append(itemDTO)

            return CategoryDTO(category, categoryImage, items)
        except Exception as e:
            print(f"An error occurred while retrieving CategoryDTO: {str(e)}")
            raise
