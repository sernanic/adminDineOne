from app.models.item import Item
from app.models.category import Category
from app.models.item_group import ItemGroup
from app.models.modifier import Modifier
from app.models.clover_integration import CloverIntegration
from app import db
from datetime import datetime
from app.enums.integrations import IntegrationsEnum
from app.models.categoryImages import CategoryImage
from app.models.itemImages import ItemImage
from app.models.modifier_group import ModifierGroup
from app.models.modifierImages import ModifierImage

class SupabaseService:

    @staticmethod
    def insert_or_update_item(item_data, merchant_id):
        item = Item.query.filter_by(item_id=item_data['id']).first()  # Use Clover's id to find the item
        print("item", item)
        modified_time = datetime.fromtimestamp(item_data.get('modifiedTime', datetime.now().timestamp() * 1000) / 1000.0)
        if item:
            # Update existing item
            item.item_id = item_data['id']
            item.hidden = item_data.get('hidden', item.hidden)
            item.available = item_data.get('available', item.available)
            item.auto_manage = item_data.get('autoManage', item.auto_manage)
            item.name = item_data['name']
            item.price = item_data['price']
            item.price_type = item_data.get('priceType', item.price_type or '')  # Ensure price_type is not None
            item.default_tax_rates = item_data.get('defaultTaxRates', item.default_tax_rates)
            item.cost = item_data.get('cost', item.cost)
            item.is_revenue = item_data.get('isRevenue', item.is_revenue)
            item.modified_time = modified_time
            item.deleted = item_data.get('deleted', item.deleted)
            item.merchant_id = merchant_id
        else:
            # Insert new item
            item = Item(
                item_id=item_data['id'],  # Map Clover's id to item_id
                hidden=item_data.get('hidden', False),
                available=item_data.get('available', True),
                auto_manage=item_data.get('autoManage', False),
                name=item_data['name'],
                price=item_data['price'],
                price_type=item_data.get('priceType', ''),  # Ensure price_type is not None
                default_tax_rates=item_data.get('defaultTaxRates', False),
                cost=item_data.get('cost', 0),  # Ensure cost is not None
                is_revenue=item_data.get('isRevenue', False),
                modified_time=modified_time,
                deleted=item_data.get('deleted', False),
                merchant_id=merchant_id
            )
            db.session.add(item)

        db.session.commit()

    @staticmethod
    def get_items_by_merchant_id(merchant_id):
        """
        Retrieve all items for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Item objects
        """
        return Item.query.filter_by(merchant_id=merchant_id).all()

    @staticmethod
    def insert_or_update_category(category_data, merchant_id):
        category = Category.query.filter_by(categoryId=category_data['id']).first()  # Use Clover's id to find the category
        if category:
            # Update existing category
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
                merchantId=merchant_id
            )
            db.session.add(category)

        db.session.commit()

    @staticmethod
    def getCategoriesByMerchantId(merchant_id):
        """
        Retrieve all categories for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Category objects
        """
        return Category.query.filter_by(merchantId=merchant_id).all()

    @staticmethod
    def getCategoryById(merchant_id, category_id):
        return Category.query.filter_by(merchantId=merchant_id, categoryId=category_id).first()

    @staticmethod
    def insertOrUpdateItemGroup(itemGroupData, merchantId):
        itemGroup = ItemGroup.query.filter_by(itemGroupId=itemGroupData['id']).first()
        modifiedTime = datetime.fromtimestamp(itemGroupData.get('modifiedTime', datetime.now().timestamp() * 1000) / 1000.0)
        
        if itemGroup:
            # Update existing item group
            itemGroup.name = itemGroupData['name']
            itemGroup.sortOrder = itemGroupData.get('sortOrder')
            itemGroup.deleted = itemGroupData.get('deleted', False)
            itemGroup.modifiedTime = modifiedTime
        else:
            # Insert new item group
            itemGroup = ItemGroup(
                itemGroupId=itemGroupData['id'],
                name=itemGroupData['name'],
                sortOrder=itemGroupData.get('sortOrder'),
                deleted=itemGroupData.get('deleted', False),
                modifiedTime=modifiedTime,
                merchantId=merchantId
            )
            db.session.add(itemGroup)

        db.session.commit()

    @staticmethod
    def getItemGroupsByMerchantId(merchantId):
        return ItemGroup.query.filter_by(merchantId=merchantId).all()

    @staticmethod
    def insertOrUpdateModifierGroup(modifierGroupData, merchantId):
        modifierGroup = ModifierGroup.query.filter_by(modifierGroupId=modifierGroupData['id']).first()
        if modifierGroup:
            # Update existing modifier group
            print("existing modifier group")
            modifierGroup.name = modifierGroupData['name']
            modifierGroup.showByDefault = modifierGroupData.get('showByDefault', modifierGroup.showByDefault)
            modifierGroup.sortOrder = modifierGroupData.get('sortOrder', modifierGroup.sortOrder)
            modifierGroup.deleted = modifierGroupData.get('deleted', modifierGroup.deleted)
        else:
            # Insert new modifier group
            print("new modifier group")
            modifierGroup = ModifierGroup(
                modifierGroupId=modifierGroupData['id'],
                merchantId=merchantId,
                name=modifierGroupData['name'],
                showByDefault=modifierGroupData.get('showByDefault', False),
                sortOrder=modifierGroupData.get('sortOrder', 0),
                deleted=modifierGroupData.get('deleted', False)
            )
            db.session.add(modifierGroup)

        db.session.commit()

    @staticmethod
    def getModifierGroupsByMerchantId(merchantId):
        return ModifierGroup.query.filter_by(merchantId=merchantId).all()

    @staticmethod
    def getModifiersByMerchantId(merchantId):
        """
        Retrieve all modifiers for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Modifier objects
        """
        return Modifier.query.filter_by(merchantId=merchantId).all()

    @staticmethod
    def getModifiers(merchantId, modifierGroupId):
        """
        Retrieve all modifiers for a given merchantId and modifierGroupId.
        
        :param merchantId: The ID of the merchant
        :param modifierGroupId: The ID of the modifier group
        :return: A list of Modifier objects
        """
        return Modifier.query.filter_by(merchantId=merchantId, modifierGroupId=modifierGroupId).all()

    @staticmethod
    def insertOrUpdateModifier(modifierData, merchantId):
        modifier = Modifier.query.filter_by(modifierId=modifierData['id']).first()
        modifiedTime = datetime.fromtimestamp(modifierData.get('modifiedTime', datetime.now().timestamp() * 1000) / 1000.0)

        if modifier:
            # Update existing modifier
            modifier.name = modifierData['name']
            modifier.available = modifierData.get('available', modifier.available)
            modifier.price = modifierData['price']
            modifier.modifiedTime = modifiedTime
            modifier.modifierGroupId = modifierData['modifierGroup']['id']
            modifier.deleted = modifierData.get('deleted', modifier.deleted)
        else:
            # Insert new modifier
            modifier = Modifier(
                modifierId=modifierData['id'],
                merchantId=merchantId,
                name=modifierData['name'],
                available=modifierData.get('available', True),
                price=modifierData['price'],
                modifiedTime=modifiedTime,
                modifierGroupId=modifierData['modifierGroup']['id'],
                deleted=modifierData.get('deleted', False)
            )
            db.session.add(modifier)

        db.session.commit()

    @staticmethod
    def insertOrUpdateIntegration(clientId, integrationTypeId):
        from app.models.integration import Integration  # Import here to avoid circular import
        
        # Convert clientId and integrationTypeId to int
        clientId = int(clientId)
        integrationTypeId = int(integrationTypeId)
        
        # Check for existing Toast or Square integrations
        existing_integration = Integration.query.filter_by(clientId=clientId).first()
        if existing_integration:
            if existing_integration.integrationTypeId in [IntegrationsEnum.TOAST.value, IntegrationsEnum.SQUARE.value]:
                raise ValueError("Client already has a Toast or Square integration. Cannot add another integration.")
        
        integration = Integration(
            clientId=clientId,
            integrationTypeId=integrationTypeId
        )
        
        db.session.merge(integration)
        db.session.commit()
        
        return integration

    @staticmethod
    def getIntegrationByClientId(clientId):
        from app.models.integration import Integration  # Import here to avoid circular import
        return Integration.query.filter_by(clientId=clientId).first()

    @staticmethod
    def addOrUpdateCloverIntegration(clientId, apiKey):
        """
        Add a new Clover integration or update an existing one in the cloverIntegration table.

        :param clientId: The client ID
        :param apiKey: The API key for the Clover integration
        :return: The created or updated CloverIntegration object
        """
        print("adding or updating clover integration")
        try:
            existingIntegration = CloverIntegration.query.filter_by(clientId=clientId).first()
            print("existingIntegration", existingIntegration)
            if existingIntegration:
                # Update existing integration
                existingIntegration.apiKey = apiKey
                db.session.commit()
                return existingIntegration
            else:
                # Insert new integration
                print("inserting new integration")
                newIntegration = CloverIntegration(
                    clientId=clientId,
                    apiKey=apiKey
                )
                print("newIntegration", newIntegration)
                db.session.add(newIntegration)
                db.session.commit()
                return newIntegration
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            db.session.rollback()  # Add this line to rollback the session in case of an error
            raise  # Re-raise the exception after printing it

    @staticmethod
    def getCloverIntegrationByClientId(clientId):
        """
        Retrieve the Clover integration for a given clientId.
        
        :param clientId: The ID of the client
        :return: A CloverIntegration object or None if not found
        """
        return CloverIntegration.query.filter_by(clientId=clientId).first()

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
    def get_item_by_id(merchant_id, item_id):
        """
        Retrieve a specific item for a given merchant_id and item_id.
        
        :param merchant_id: The ID of the merchant
        :param item_id: The ID of the item
        :return: An Item object or None if not found
        """
        return Item.query.filter_by(merchant_id=merchant_id, item_id=item_id).first()

    @staticmethod
    def insertOrUpdateItemImages(itemId, imageUrls):
        """
        Insert new item images or update existing ones in the itemImages table.

        :param itemId: The ID of the item
        :param imageUrls: List of image URLs (up to 6)
        :return: List of created or updated ItemImage objects
        """
        try:
            existingImages = ItemImage.query.filter_by(itemId=itemId).all()
            
            # Delete existing images not in the new list
            for existingImage in existingImages:
                if existingImage.imageUrl not in imageUrls:
                    db.session.delete(existingImage)
            
            # Add or update images
            updatedImages = []
            for index, url in enumerate(imageUrls):
                if index < len(existingImages):
                    # Update existing image
                    existingImages[index].imageUrl = url
                    updatedImages.append(existingImages[index])
                else:
                    # Insert new image
                    newImage = ItemImage(
                        itemId=itemId,
                        imageUrl=url
                    )
                    db.session.add(newImage)
                    updatedImages.append(newImage)
            
            db.session.commit()
            return updatedImages
        except Exception as e:
            print(f"An error occurred while inserting/updating item images: {str(e)}")
            db.session.rollback()
            raise
    
    @staticmethod
    def insertItemImage(item_id, image_url):
        """
        Insert a new item image or update an existing one in the itemImages table.
        Raises an error if there are already 6 or more images for the item.

        :param item_id: The ID of the item
        :param image_url: The URL of the image
        :return: The created or updated ItemImage object
        :raises ValueError: If there are already 6 or more images for the item
        """
        try:
            # Count existing images for the item
            existing_image_count = ItemImage.query.filter_by(itemId=item_id).count()
            
            if existing_image_count >= 6:
                raise ValueError(f"Item {item_id} already has 6 or more images. Cannot add more.")
            
            # Insert new image
            newItemImage = ItemImage(
                imageURL=image_url,
                itemId=item_id
            )
            db.session.add(newItemImage)
            db.session.commit()
            return newItemImage
        except Exception as e:
            print(f"An error occurred while inserting item image: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def getItemImagesByItemId(itemId):
        """
        Retrieve all images for a given item ID.
        
        :param itemId: The ID of the item
        :return: A list of ItemImage objects or an empty list if not found
        """
        return ItemImage.query.filter_by(itemId=itemId).all()

    @staticmethod
    def deleteItemImage(itemImageId):
        """
        Delete an item image from the itemImages table.

        :param itemImageId: The ID of the item image to delete
        :return: True if the image was successfully deleted, False if the image was not found
        :raises Exception: If there's an error during the deletion process
        """
        try:
            itemImage = ItemImage.query.get(itemImageId)
            if itemImage:
                db.session.delete(itemImage)
                db.session.commit()
                return True
            else:
                return False
        except Exception as e:
            print(f"An error occurred while deleting item image: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def getModifiersByIds(id_list_string):
        """
        Retrieve all modifiers whose IDs are in the given comma-separated string of IDs.

        :param id_list_string: A string of comma-separated modifier IDs (e.g., "7JJ329CPT56WR,8KK430DQU67XS")
        :return: A list of Modifier objects
        """
        # Split the string into a list of IDs and strip any whitespace
        id_list = [id.strip() for id in id_list_string.split(',') if id.strip()]

        # Query the database for modifiers with IDs in the list
        modifiers = Modifier.query.filter(Modifier.modifierId.in_(id_list)).all()

        return modifiers
    
    @staticmethod
    def getModifierById(merchantId,modifierId ):
        """
        Retrieve a single modifier based on modifierId and merchantId

        :param modifierId: A string representing the modifier ID
        :param merchantId: A string representing the merchant ID
        :return: A Modifier object or None if not found
        """
        return Modifier.query.filter_by(modifierId=modifierId, merchantId=merchantId).first()

    @staticmethod
    def insertModifierImage(modifierId, imageUrl):
        modifierImage = ModifierImage(imageUrl=imageUrl, modifierId=modifierId)
        db.session.add(modifierImage)
        db.session.commit()
        return modifierImage

    @staticmethod
    def getModifierImageByModifierId(modifierId):
        return ModifierImage.query.filter_by(modifierId=modifierId).first()

    @staticmethod
    def updateModifierImage(modifierId, imageUrl):
        modifierImage = ModifierImage.query.filter_by(modifierId=modifierId).first()
        if modifierImage:
            modifierImage.imageUrl = imageUrl
            db.session.commit()
        return modifierImage