from typing import List, Optional
import requests
from flask import current_app
from app.services.supabase_service import SupabaseService
from app.dto.category_dto import CategoryDTO
from app.dto.item_dto import ItemDTO
from app.models.category import Category
from app.models.categoryImages import CategoryImage
from app.models.item import Item
from app.models.categoryItem import CategoryItem
from app import db


class CategoryService:
    
    @staticmethod
    def getCategoriesByMerchantId(merchantId: str, clientId: int) -> List[CategoryDTO]:
        categories = CategoryService.getCategoriesByMerchantId(merchantId, clientId)
        return [CategoryService.getCategoryDTOByCategoryId(category.categoryId, merchantId, clientId) for category in categories]

    @staticmethod
    def getCategoryDTOByCategoryId(categoryId: str, merchantId: str, clientId: int) -> Optional[CategoryDTO]:
        """
        Retrieve a CategoryDTO containing the category, its associated images, and items.

        :param categoryId: The ID of the category
        :param merchantId: The ID of the merchant
        :param clientId: The ID of the client
        :return: A CategoryDTO object or None if not found
        """
        try:
            category = CategoryService.getPublicCategoryById(merchantId, categoryId)
            if not category:
                return None

            categoryImage = CategoryService.getCategoryImageByCategoryId(categoryId)
            # Fetch items associated with this category
            categoryItems = CategoryService.getCategoryItemsByCategoryId(merchantId,categoryId, clientId)
            items = []
            for categoryItem in categoryItems:
                item = SupabaseService.getItemById(merchantId, categoryItem.itemId, clientId)
                if item:
                    itemImages = SupabaseService.getItemImagesByItemId(item.itemId, clientId)
                    itemDTO = ItemDTO.fromModel(item, itemImages)
                    items.append(itemDTO)

            return CategoryDTO(category, categoryImage, items)
        except Exception as e:
            print(f"An error occurred while retrieving CategoryDTO: {str(e)}")
            raise
        
    @staticmethod
    def insertOrUpdateCategory(categoryData: dict, merchantId: str, clientId: int) -> Category:
        # Get the category ID from either 'id' or 'categoryId' field
        category_id = categoryData.get('id') or categoryData.get('categoryId')
        if not category_id:
            raise ValueError("Category ID is required")
            
        category = Category.query.filter_by(categoryId=category_id, merchantId=merchantId, clientId=clientId).first()
        
        if category:
            # Update existing category
            if category.clientId != clientId:
                raise ValueError("Category does not belong to the specified client")
            category.categoryId = category_id
            category.name = categoryData['name']
            category.sortOrder = categoryData.get('sortOrder', category.sortOrder)
            category.deleted = categoryData.get('deleted', category.deleted)
            category.merchantId = merchantId
        else:
            # Insert new category
            category = Category(
                categoryId=category_id,
                name=categoryData['name'],
                sortOrder=categoryData.get('sortOrder', None),
                deleted=categoryData.get('deleted', False),
                merchantId=merchantId,
                clientId=clientId
            )
            db.session.add(category)
        db.session.commit()
        return category

    @staticmethod
    def getCategoriesByMerchantId(merchant_id: str, client_id: int) -> List[Category]:
        """
        Retrieve all categories for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Category objects
        """
        return Category.query.filter_by(merchantId=merchant_id, clientId=client_id).all()
    
    @staticmethod
    def getPublicCategoriesByMerchantId(merchant_id: str) -> List[Category]:
        """
        Retrieve all categories for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Category objects
        """
        return Category.query.filter_by(merchantId=merchant_id).all()

    @staticmethod
    def getCategoryById(merchant_id: str, category_id: str, client_id: int) -> Optional[Category]:
        return Category.query.filter_by(merchantId=merchant_id, categoryId=category_id, clientId=client_id).first()
    
    @staticmethod
    def getPublicCategoryById(merchant_id: str, category_id: str) -> Optional[Category]:
        return Category.query.filter_by(merchantId=merchant_id, categoryId=category_id).first()
    
    @staticmethod
    def insertCategoryImage(category_id: str, image_url: str, clientId: int) -> CategoryImage:
        """
        Insert a new category image or update an existing one in the categoryImages table.

        :param category_id: The ID of the category
        :param image_url: The URL of the image
        :return: The created or updated CategoryImage object
        """
        try:
            existing_image = CategoryImage.query.filter_by(categoryId=category_id, clientId=clientId).first()
            
            if existing_image:
                # Update existing image
                existing_image.imageURL = image_url
                db.session.commit()
                return existing_image
            else:
                # Insert new image
                newCategoryImage = CategoryImage(
                    imageURL=image_url,
                    categoryId=category_id,
                    clientId=clientId
                )
                db.session.add(newCategoryImage)
                db.session.commit()
                return newCategoryImage
        except Exception as e:
            print(f"An error occurred while inserting/updating category image: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def getCategoryImageByCategoryId(category_id: str) -> Optional[CategoryImage]:
        """
        Retrieve the category image for a given category ID.
        
        :param category_id: The ID of the category
        :return: A CategoryImage object or None if not found
        """
        return CategoryImage.query.filter_by(categoryId=category_id).first()
    
    @staticmethod
    def getCategoryItemsByCategoryId(merchantId: str, categoryId: str, clientId: int) -> List[Item]:
        """
        Retrieve all items associated with a specific category for a given merchant and client.

        :param merchantId: The ID of the merchant
        :param categoryId: The ID of the category
        :param clientId: The ID of the client
        :return: A list of Item objects associated with the specified category
        """
        try:
            # Query items that belong to the specified category, merchant, and client
            categoryItems = Item.query.join(Item.categories).filter(
                Item.merchant_id == merchantId,
                Item.clientId == clientId,
                Category.categoryId == categoryId
            ).all()
            
            return categoryItems
        except Exception as e:
            print(f"An error occurred while retrieving category items: {str(e)}")
            raise

    @staticmethod
    def insertOrUpdateCategoryItem(categoryId: str, itemId: str, clientId: int) -> CategoryItem:
        """
        Insert a new CategoryItem or update an existing one.

        :param categoryId: The ID of the category
        :param itemId: The ID of the item
        :param clientId: The ID of the client
        :return: The created or updated CategoryItem object
        """
        try:
            categoryItem = CategoryItem.query.filter_by(
                categoryId=categoryId,
                itemId=itemId,
                clientId=clientId
            ).first()

            if categoryItem:
                # CategoryItem already exists, no need to update anything
                return categoryItem
            else:
                # Insert new CategoryItem
                newCategoryItem = CategoryItem(
                    categoryId=categoryId,
                    itemId=itemId,
                    clientId=clientId
                )
                db.session.add(newCategoryItem)
                db.session.commit()
                return newCategoryItem
        except Exception as e:
            print(f"An error occurred while inserting/updating CategoryItem: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def deleteCategoryImage(category_id: str, client_id: int) -> bool:
        """
        Delete a category image from the database.

        :param category_id: The ID of the category
        :param client_id: The ID of the client
        :return: True if deletion was successful, False if image was not found
        """
        try:
            category_image = CategoryImage.query.filter_by(
                categoryId=category_id,
                clientId=client_id
            ).first()
            
            if category_image:
                db.session.delete(category_image)
                db.session.commit()
                return True
            return False
        except Exception as e:
            print(f"An error occurred while deleting category image: {str(e)}")
            db.session.rollback()
            raise
