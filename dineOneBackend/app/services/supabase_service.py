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
from app.models.client import Client
from app.models.user import User
from app.models.merchant import Merchant
from app.models.categoryItem import CategoryItem
from app.models.itemModifierGroups import ItemModifierGroup
from flask import current_app
from app.dto.modifier_group_dto import ModifierGroupDTO
from app.dto.modifier_dto import ModifierDTO


class SupabaseService:

    @staticmethod
    def insertOrUpdateItem(item_data, merchant_id, client_id):
        item = Item.query.filter_by(itemId=item_data['id'], merchant_id=merchant_id, clientId=client_id).first()  # Use Clover's id to find the item
        modified_time = datetime.fromtimestamp(item_data.get('modifiedTime', datetime.now().timestamp() * 1000) / 1000.0)
        if item:
            # Update existing item
            if item.clientId != client_id:
                raise ValueError("Item does not belong to the specified client")
            item.itemId = item_data['id']
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
                itemId=item_data['id'],  # Map Clover's id to itemId
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
                merchant_id=merchant_id,
                clientId=client_id
            )
            db.session.add(item)

        db.session.commit()

    @staticmethod
    def getItemsByMerchantId(merchant_id, clientId):
        """
        Retrieve all items for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Item objects
        """
        return Item.query.filter_by(merchant_id=merchant_id, clientId=clientId).all()
    
    @staticmethod
    def insertOrUpdateItemGroup(itemGroupData, merchantId, clientId):
        itemGroup = ItemGroup.query.filter_by(itemGroupId=itemGroupData['id'], merchantId=merchantId, clientId=clientId).first()
        modifiedTime = datetime.fromtimestamp(itemGroupData.get('modifiedTime', datetime.now().timestamp() * 1000) / 1000.0)
        
        if itemGroup:
            # Update existing item group
            if itemGroup.clientId != clientId:
                raise ValueError("ItemGroup does not belong to the specified client")
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
                merchantId=merchantId,
                clientId=clientId
            )
            db.session.add(itemGroup)

        db.session.commit()

    @staticmethod
    def getItemGroupsByMerchantId(merchantId, clientId):
        return ItemGroup.query.filter_by(merchantId=merchantId, clientId=clientId).all()

    @staticmethod
    def insertOrUpdateModifierGroup(modifierGroupData, merchantId, clientId):
        modifierGroup = ModifierGroup.query.filter_by(modifierGroupId=modifierGroupData['id'], merchantId=merchantId, clientId=clientId).first()
        if modifierGroup:
            # Update existing modifier group
            if modifierGroup.clientId != clientId:
                raise ValueError("ModifierGroup does not belong to the specified client")
            modifierGroup.name = modifierGroupData['name']
            modifierGroup.showByDefault = modifierGroupData.get('showByDefault', modifierGroup.showByDefault)
            modifierGroup.sortOrder = modifierGroupData.get('sortOrder', modifierGroup.sortOrder)
            modifierGroup.deleted = modifierGroupData.get('deleted', modifierGroup.deleted)
        else:
            # Insert new modifier group
            modifierGroup = ModifierGroup(
                modifierGroupId=modifierGroupData['id'],
                merchantId=merchantId,
                clientId=clientId,
                name=modifierGroupData['name'],
                showByDefault=modifierGroupData.get('showByDefault', False),
                sortOrder=modifierGroupData.get('sortOrder', 0),
                deleted=modifierGroupData.get('deleted', False)
            )
            db.session.add(modifierGroup)

        db.session.commit()

    @staticmethod
    def getModifierGroupsByMerchantId(merchantId, clientId):
        return ModifierGroup.query.filter_by(merchantId=merchantId, clientId=clientId).all()

    @staticmethod
    def getModifiersByMerchantId(merchantId, clientId):
        """
        Retrieve all modifiers for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Modifier objects
        """
        return Modifier.query.filter_by(merchantId=merchantId, clientId=clientId).all()

    @staticmethod
    def getModifiers(merchantId, modifierGroupId, clientId):
        """
        Retrieve all modifiers for a given merchantId and modifierGroupId.
        
        :param merchantId: The ID of the merchant
        :param modifierGroupId: The ID of the modifier group
        :return: A list of Modifier objects
        """
        return Modifier.query.filter_by(merchantId=merchantId, modifierGroupId=modifierGroupId, clientId=clientId).all()

    @staticmethod
    def insertOrUpdateModifier(modifierData, merchantId, clientId):
        modifier = Modifier.query.filter_by(modifierId=modifierData['id'], merchantId=merchantId, clientId=clientId).first()
        modifiedTime = datetime.fromtimestamp(modifierData.get('modifiedTime', datetime.now().timestamp() * 1000) / 1000.0)

        if modifier:
            # Update existing modifier
            if modifier.clientId != clientId:
                raise ValueError("Modifier does not belong to the specified client")
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
                clientId=clientId,
                name=modifierData['name'],
                available=modifierData.get('available', True),
                price=modifierData['price'],
                modifiedTime=modifiedTime,
                modifierGroupId=modifierData['modifierGroup']['id'],
                deleted=modifierData.get('deleted', False),
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
    def getItemById(merchant_id, itemId, client_id):
        """
        Retrieve a specific item for a given merchant_id and itemId.
        
        :param merchant_id: The ID of the merchant
        :param itemId: The ID of the item
        :return: An Item object or None if not found
        """
        return Item.query.filter_by(merchant_id=merchant_id, itemId=itemId, clientId=client_id).first()

    @staticmethod
    def insertOrUpdateItemImages(itemId, imageUrls, clientId):
        """
        Insert new item images or update existing ones in the itemImages table.

        :param itemId: The ID of the item
        :param imageUrls: List of image URLs (up to 6)
        :return: List of created or updated ItemImage objects
        """
        try:
            existingImages = ItemImage.query.filter_by(itemId=itemId, clientId=clientId).all()
            
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
                        imageUrl=url,
                        clientId=clientId
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
    def insertItemImage(itemId, imageUrl, clientId):
        """
        Insert a new item image or update an existing one in the itemImages table.
        Raises an error if there are already 6 or more images for the item.

        :param itemId: The ID of the item
        :param image_url: The URL of the image
        :return: The created or updated ItemImage object
        :raises ValueError: If there are already 6 or more images for the item
        """
        try:
            # Count existing images for the item
            existing_image_count = ItemImage.query.filter_by(itemId=itemId).count()
            
            if existing_image_count >= 6:
                raise ValueError(f"Item {itemId} already has 6 or more images. Cannot add more.")
            
            # Insert new image
            newItemImage = ItemImage(
                imageURL=imageUrl,
                itemId=itemId,
                clientId=clientId
            )
            db.session.add(newItemImage)
            db.session.commit()
            return newItemImage
        except Exception as e:
            print(f"An error occurred while inserting item image: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def getItemImagesByItemId(itemId, clientId):
        """
        Retrieve all images for a given item ID.
        
        :param itemId: The ID of the item
        :return: A list of ItemImage objects or an empty list if not found
        """
        return ItemImage.query.filter_by(itemId=itemId, clientId=clientId).all()

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
    def getModifiersByIds(idListString, clientId):
        """
        Retrieve all modifiers whose IDs are in the given comma-separated string of IDs.

        :param id_list_string: A string of comma-separated modifier IDs (e.g., "7JJ329CPT56WR,8KK430DQU67XS")
        :return: A list of Modifier objects
        """
        # Split the string into a list of IDs and strip any whitespace
        idList = [id.strip() for id in idListString.split(',') if id.strip()]

        # Query the database for modifiers with IDs in the list
        modifiers = Modifier.query.filter(Modifier.modifierId.in_(idList), Modifier.clientId == clientId).all()

        return modifiers
    
    @staticmethod
    def getModifierById(merchantId, modifierId, clientId):
        """
        Retrieve a single modifier based on modifierId and merchantId

        :param modifierId: A string representing the modifier ID
        :param merchantId: A string representing the merchant ID
        :return: A Modifier object or None if not found
        """
        return Modifier.query.filter_by(modifierId=modifierId, merchantId=merchantId, clientId=clientId).first()

    @staticmethod
    def insertModifierImage(modifierId, imageUrl, clientId):
        modifierImage = ModifierImage(imageUrl=imageUrl, modifierId=modifierId, clientId=clientId)
        db.session.add(modifierImage)
        db.session.commit()
        return modifierImage

    @staticmethod
    def getModifierImageByModifierId(modifierId, clientId):
        return ModifierImage.query.filter_by(modifierId=modifierId, clientId=clientId).first()

    @staticmethod
    def updateModifierImage(modifierId, imageUrl, clientId):
        modifierImage = ModifierImage.query.filter_by(modifierId=modifierId, clientId=clientId).first()
        if modifierImage:
            if modifierImage.clientId != clientId:
                raise ValueError("ModifierImage does not belong to the specified client")
            modifierImage.imageUrl = imageUrl
            db.session.commit()
        return modifierImage

    @staticmethod
    def insertClient(restaurantName):
        """
        Insert a new client into the client table.

        :param restaurantName: The name of the restaurant
        :return: The created Client object
        """
        try:
            newClient = Client(
                name=restaurantName
            )
            db.session.add(newClient)
            db.session.commit()
            return newClient
        except Exception as e:
            print(f"An error occurred while inserting client: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def insertUser(clientId, firstName, lastName, email, activationCode, isActive, isAdmin, uid):
        try:

            isAdminBool = isAdmin == 'on'
            
            newUser = User(
                clientId=clientId,
                firstName=firstName,
                lastName=lastName,
                email=email,
                activationCode=activationCode,
                isActive=isActive,
                isAdmin=isAdminBool,  # Use the converted boolean value
                uid=uid
            )
            db.session.add(newUser)
            db.session.commit()
            return newUser
        except Exception as e:
            print("Error inserting user:", str(e))
            db.session.rollback()
            raise

    @staticmethod
    def getUser(userId):
        try:
            user = User.query.get(userId)
            return user
        except Exception as e:
            print("Error getting user:", str(e))
            raise

    @staticmethod
    def getUserByUid(uid):
        try:
            user = User.query.filter_by(uid=uid).first()
            return user
        except Exception as e:
            print("Error getting user by UID:", str(e))
            raise
    
    @staticmethod
    def getMerchants(clientId):
        """
        Retrieve all merchants for a given clientId from the merchants table.
        
        :param clientId: The ID of the client
        :return: A list of Merchant objects
        """
        try:
            merchants = Merchant.query.filter_by(clientId=clientId).all()
            return merchants
        except Exception as e:
            print(f"An error occurred while retrieving merchants for clientId {clientId}: {str(e)}")
            raise

    @staticmethod
    def addMerchant(merchant):
        """
        Add a new merchant to the database.

        :param merchant: A Merchant object containing the merchant details
        :return: The added Merchant object with updated information (e.g., assigned ID)
        """
        try:
            db.session.add(merchant)
            db.session.commit()
            return merchant
        except Exception as e:
            print(f"An error occurred while adding merchant: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def getUsers(clientId):
        try:
            users = User.query.filter_by(clientId=clientId).all()
            return users
        except Exception as e:
            print(f"Error getting users for clientId {clientId}:", str(e))
            raise

    @staticmethod
    def getUserByActivationCode(activationCode):
        try:
            user = User.query.filter_by( activationCode=activationCode, isActive=False).first()
            return user
        except Exception as e:
            print("Error getting user by activation code:", str(e))
            raise

    @staticmethod
    def activateUser(user, email, uid):
        try:
            user.email = email
            user.isActive = True
            user.uid = uid
            db.session.commit()
            return user
        except Exception as e:
            print("Error activating user:", str(e))
            db.session.rollback()
            raise

    @staticmethod
    def updateUser(user, firstName, lastName, email):
        try:
            user.firstName = firstName
            user.lastName = lastName
            user.email = email
            db.session.commit()
            return user
        except Exception as e:
            print("Error updating user:", str(e))
            db.session.rollback()
            raise

    @staticmethod
    def updateUserAvatarUrl(user, avatarUrl):
        try:
            user.avatarUrl = avatarUrl
            db.session.commit()
            return user
        except Exception as e:
            print("Error updating user avatar URL:", str(e))
            db.session.rollback()
            raise

    @staticmethod
    def getModifierGroupDTO(clientId, modifierGroupId):
        """
        Retrieve a ModifierGroupDTO populated with the modifier group and its associated modifiers,
        including the image for each modifier.

        :param clientId: The ID of the client
        :param modifierGroupId: The ID of the modifier group
        :return: A populated ModifierGroupDTO object
        """
        try:
            # Get the modifier group
            modifierGroup = ModifierGroup.query.filter_by(
                modifierGroupId=modifierGroupId,
                clientId=clientId
            ).first()

            if not modifierGroup:
                return None

            # Get all modifiers associated with this modifier group
            modifiers = Modifier.query.filter_by(
                modifierGroupId=modifierGroupId,
                clientId=clientId
            ).all()

            # Get all modifier IDs
            modifierIds = [modifier.modifierId for modifier in modifiers]

            # Bulk query for all modifier images
            modifierImages = ModifierImage.query.filter(
                ModifierImage.modifierId.in_(modifierIds),
                ModifierImage.clientId == clientId
            ).all()

            # Create a dictionary for quick lookup of modifier images
            imageDict = {image.modifierId: image for image in modifierImages}

            # Create ModifierDTO objects for each modifier, including the image
            modifierDTOs = []
            for modifier in modifiers:
                modifierImage = imageDict.get(modifier.modifierId)
                modifierDTO = ModifierDTO.fromModel(modifier, modifierImage)
                modifierDTOs.append(modifierDTO)

            # Create and return the ModifierGroupDTO
            return ModifierGroupDTO(modifierGroup, modifierDTOs)

        except Exception as e:
            print(f"An error occurred while retrieving modifier group with modifiers: {str(e)}")
            raise

    @staticmethod
    def insertItemModifierGroup(itemId, modifierGroupId, clientId):
        """
        Insert a new record into the itemModifierGroups table.

        :param itemId: The ID of the item
        :param modifierGroupId: The ID of the modifier group
        :param clientId: The ID of the client
        :return: The created ItemModifierGroup object
        """
        try:
            # Check if the record already exists
            existingRecord = ItemModifierGroup.query.filter_by(
                itemId=itemId,
                modifierGroupId=modifierGroupId,
                clientId=clientId
            ).first()

            if existingRecord:
                # If the record already exists, return it without making changes
                return existingRecord

            # Create a new ItemModifierGroup object
            newItemModifierGroup = ItemModifierGroup(
                itemId=itemId,
                modifierGroupId=modifierGroupId,
                clientId=clientId
            )

            # Add the new record to the session and commit
            db.session.add(newItemModifierGroup)
            db.session.commit()

            return newItemModifierGroup

        except Exception as e:
            print(f"An error occurred while inserting ItemModifierGroup: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def getModifierGroupsByItemId(itemId, clientId):
        """
        Retrieve all modifier groups related to a specific item for a given client.

        :param itemId: The ID of the item
        :param clientId: The ID of the client
        :return: A list of ModifierGroup objects associated with the specified item
        """
        try:
            modifierGroups = ModifierGroup.query.join(ItemModifierGroup).join(Item).filter(
                Item.itemId == itemId,
                Item.clientId == clientId,
                ModifierGroup.clientId == clientId
            ).all()
            
            return modifierGroups
        except Exception as e:
            print(f"An error occurred while retrieving modifier groups for item {itemId}: {str(e)}")
            raise

    @staticmethod
    def getModifiersByModifierGroupId(modifierGroupId, clientId):
        """
        Retrieve all modifiers associated with a specific modifier group for a given client.

        :param modifierGroupId: The ID of the modifier group
        :param clientId: The ID of the client
        :return: A list of Modifier objects associated with the specified modifier group
        """
        try:
            modifiers = Modifier.query.filter_by(
                modifierGroupId=modifierGroupId,
                clientId=clientId
            ).all()
            
            return modifiers
        except Exception as e:
            print(f"An error occurred while retrieving modifiers for modifier group {modifierGroupId}: {str(e)}")
            raise

    @staticmethod
    def getModifierGroupDTOsByItemId(itemId, clientId):
        """
        Retrieve a list of ModifierGroupDTOs for a specific item.

        :param itemId: The ID of the item
        :param clientId: The ID of the client
        :return: A list of ModifierGroupDTO objects associated with the specified item
        """
        try:
            modifierGroups = SupabaseService.getModifierGroupsByItemId(itemId, clientId)
            
            modifierGroupDTOs = []
            for modifierGroup in modifierGroups:
                # Get the ModifierGroupDTO for each modifier group
                modifierGroupDTO = SupabaseService.getModifierGroupDTO(clientId, modifierGroup.modifierGroupId)
                if modifierGroupDTO:
                    modifierGroupDTOs.append(modifierGroupDTO.toDict())
            
            return modifierGroupDTOs

        except Exception as e:
            print(f"An error occurred while retrieving ModifierGroupDTOs for item {itemId}: {str(e)}")
            raise









