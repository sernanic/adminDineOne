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
    def getCategoriesByMerchantId(merchantId, clientId):
        categories = CategoryService.getCategoriesByMerchantId(merchantId, clientId)
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
    def insertOrUpdateCategory(category_data, merchant_id, client_id):
        category = Category.query.filter_by(categoryId=category_data['id'], merchantId=merchant_id, clientId=client_id).first()  # Use Clover's id to find the category
        if category:
            # Update existing category
            if category.clientId != client_id:
                raise ValueError("Category does not belong to the specified client")
            category.categoryId = category_data['id']
            category.name = category_data['name']
            category.sortOrder = category_data.get('sortOrder', category.sortOrder)
            category.deleted = category_data.get('deleted', category.deleted)
            category.merchantId = merchant_id
        else:
            # Insert new category
            category = Category(
                categoryId=category_data['id'],  # Map Clover's id to categoryId
                name=category_data['name'],
                sortOrder=category_data.get('sortOrder', None),
                deleted=category_data.get('deleted', False),
                merchantId=merchant_id,
                clientId=client_id
            )
            db.session.add(category)
        db.session.commit()

    @staticmethod
    def getCategoriesByMerchantId(merchant_id, client_id):
        """
        Retrieve all categories for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Category objects
        """
        return Category.query.filter_by(merchantId=merchant_id, clientId=client_id).all()
    
    @staticmethod
    def getPublicCategoriesByMerchantId(merchant_id):
        """
        Retrieve all categories for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Category objects
        """
        return Category.query.filter_by(merchantId=merchant_id).all()

    @staticmethod
    def getCategoryById(merchant_id, category_id, client_id):
        return Category.query.filter_by(merchantId=merchant_id, categoryId=category_id, clientId=client_id).first()
    
    @staticmethod
    def getPublicCategoryById(merchant_id, category_id):
        return Category.query.filter_by(merchantId=merchant_id, categoryId=category_id).first()
    
    @staticmethod
    def insertCategoryImage(category_id, image_url):
        """
        Insert a new category image or update an existing one in the categoryImages table.

        :param category_id: The ID of the category
        :param image_url: The URL of the image
        :return: The created or updated CategoryImage object
        """
        try:
            existing_image = CategoryImage.query.filter_by(categoryId=category_id).first()
            
            if existing_image:
                # Update existing image
                existing_image.imageURL = image_url
                db.session.commit()
                return existing_image
            else:
                # Insert new image
                newCategoryImage = CategoryImage(
                    imageURL=image_url,
                    categoryId=category_id
                )
                db.session.add(newCategoryImage)
                db.session.commit()
                return newCategoryImage
        except Exception as e:
            print(f"An error occurred while inserting/updating category image: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def getCategoryImageByCategoryId(category_id):
        """
        Retrieve the category image for a given category ID.
        
        :param category_id: The ID of the category
        :return: A CategoryImage object or None if not found
        """
        return CategoryImage.query.filter_by(categoryId=category_id).first()
    
    @staticmethod
    def getCategoryItemsByCategoryId(merchantId, categoryId, clientId):
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
    def insertOrUpdateCategoryItem(categoryId, itemId, clientId):
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