import requests
from flask import current_app
from app.services.supabase_service import SupabaseService
from app.dto.category_dto import CategoryDTO

class CategoryService:
    @staticmethod
    def getCategoriesByMerchantId(merchantId, clientId):
        categories = SupabaseService.getCategoriesByMerchantId(merchantId, clientId)
        return categories

    @staticmethod
    def getCategoryDTOByCategoryId(categoryId, merchantId):
        """
        Retrieve a CategoryDTO containing both the category and its associated images.

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

            return CategoryDTO(category, categoryImage)
        except Exception as e:
            print(f"An error occurred while retrieving CategoryDTO: {str(e)}")
            raise
