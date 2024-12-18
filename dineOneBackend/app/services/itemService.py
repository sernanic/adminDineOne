from datetime import datetime
from flask import current_app
from app.services.supabase_service import SupabaseService
from app.dto.item_dto import ItemDTO
from app.models.itemImages import ItemImage
from app.models.item import Item
from app.models.itemModifierGroups import ItemModifierGroup
from app.models.favorite import Favorite
from app import db

class ItemService:
    @staticmethod
    def insertOrUpdateItem(item_data, merchant_id, client_id):
        try:
            item = Item.query.filter_by(itemId=item_data['id'], merchant_id=merchant_id, clientId=client_id).first()  # Use Clover's id to find the item
            modified_time = datetime.fromtimestamp(item_data.get('modifiedTime', datetime.now().timestamp() * 1000) / 1000.0)
            
            if item:
                # Update existing item
                if item.clientId != client_id:
                    raise ValueError("Item does not belong to the specified client")
                item.hidden = item_data.get('hidden', item.hidden)
                item.available = item_data.get('available', item.available)
                item.auto_manage = item_data.get('autoManage', item.auto_manage)
                item.name = item_data['name']
                item.price = item_data['price'] # clover returns price in cents
                item.price_type = item_data.get('priceType', item.price_type or '')  # Ensure price_type is not None
                item.default_tax_rates = item_data.get('defaultTaxRates', item.default_tax_rates)
                item.cost = item_data.get('cost', item.cost)
                item.is_revenue = item_data.get('isRevenue', item.is_revenue)
                item.modified_time = modified_time
                item.deleted = item_data.get('deleted', item.deleted)
                item.merchant_id = merchant_id
                item.description = item_data.get('description', item.description)
                item.isPopular = item_data.get('isPopular', item.isPopular)
            else:
                # Insert new item
                item = Item(
                    itemId=item_data['id'],  # Map Clover's id to itemId
                    hidden=item_data.get('hidden', False),
                    available=item_data.get('available', True),
                    auto_manage=item_data.get('autoManage', False),
                    name=item_data['name'],
                    price=item_data['price'], # clover returns price in cents
                    price_type=item_data.get('priceType', ''),  # Ensure price_type is not None
                    default_tax_rates=item_data.get('defaultTaxRates', False),
                    cost=item_data.get('cost', 0),  # Ensure cost is not None
                    is_revenue=item_data.get('isRevenue', False),
                    modified_time=modified_time,
                    deleted=item_data.get('deleted', False),
                    merchant_id=merchant_id,
                    clientId=client_id,
                    description=item_data.get('description', None),
                    isPopular=item_data.get('isPopular', False)
                )
                db.session.add(item)

            db.session.commit()
            return item
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def getItemsByMerchantId(merchant_id, clientId):
        """
        Retrieve all items for a given merchant_id.
        
        :param merchant_id: The ID of the merchant
        :return: A list of Item objects
        """
        return Item.query.filter_by(merchant_id=merchant_id, clientId=clientId).all()

    @staticmethod
    def getItemDTOByItemId(itemId, merchantId, clientId):
        """
        Retrieve an ItemDTO containing both the item and its associated images.

        :param itemId: The ID of the item
        :param merchantId: The ID of the merchant
        :param clientId: The ID of the client
        :return: An ItemDTO object or None if not found
        """
        try:
            item = SupabaseService.getItemById(merchantId, itemId, clientId)
            
            if not item:
                return None

            itemImages = SupabaseService.getItemImagesByItemId(itemId, clientId)

            return ItemDTO(item, itemImages)
        except Exception as e:
            print(f"An error occurred while retrieving ItemDTO: {str(e)}")
            raise
        
    @staticmethod
    def convertItemsToDTO(items, merchantId, clientId):
        """Helper function to convert items to DTO list"""
        itemDTOList = []
        for item in items:
            itemDTO = ItemService.getItemDTOByItemId(item.itemId, merchantId, clientId)
            if itemDTO:
                itemDTOList.append(itemDTO.toDict())
        return itemDTOList
    

    @staticmethod
    def updateItemImagesSortOrder(imageUpdates):
        """
        Update the sort order of multiple item images
        
        :param imageUpdates: List of dictionaries containing image id and new sort order
        :return: Boolean indicating success
        """
        try:
            for update in imageUpdates:
                itemImage = ItemImage.query.get(update['id'])
                if itemImage:
                    itemImage.sortOrder = update['sortOrder']
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error updating image sort orders: {str(e)}")
            raise

    @staticmethod
    def deleteItems(itemIds: list, merchant_id: str = None, clientId: int = None) -> None:
        """
        Delete items and their associated records (images, modifier groups, and favorites).
        
        :param itemIds: List of item IDs to delete
        :param merchant_id: Optional merchant ID filter
        :param clientId: Optional client ID filter
        """
        try:
            # First delete associated item images
            ItemImage.query.filter(
                ItemImage.itemId.in_(itemIds)
            ).delete(synchronize_session=False)
            
            # Delete associated item modifier groups
            ItemModifierGroup.query.filter(
                ItemModifierGroup.itemId.in_(itemIds)
            ).delete(synchronize_session=False)
            
            # Delete associated favorites
            Favorite.query.filter(
                Favorite.itemId.in_(itemIds)
            ).delete(synchronize_session=False)
            
            # Build the base query for items
            query = Item.query.filter(Item.itemId.in_(itemIds))
            
            # Add optional filters if provided
            if merchant_id is not None:
                query = query.filter(Item.merchant_id == merchant_id)
            if clientId is not None:
                query = query.filter(Item.clientId == clientId)
            
            # Delete the items
            query.delete(synchronize_session=False)
            
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise

    @staticmethod
    def deleteNonExistentItems(merchant_id: str, clientId: int, itemIds: list) -> None:
        """
        Delete items that exist in our database but not in Clover anymore.
        First deletes associated records from itemImages to handle foreign key constraints.
        
        :param merchant_id: The merchant ID
        :param clientId: The client ID
        :param itemIds: List of item IDs that exist in Clover
        """
        # Get all existing items for this merchant
        existing_items = Item.query.filter_by(merchant_id=merchant_id, clientId=clientId).all()
        existing_item_ids = {item.itemId for item in existing_items}
        
        # Find items to delete (exist in our DB but not in incoming data)
        items_to_delete = existing_item_ids - set(itemIds)
        
        # Delete items that no longer exist in Clover
        if items_to_delete:
            ItemService.deleteItems(list(items_to_delete), merchant_id, clientId)
