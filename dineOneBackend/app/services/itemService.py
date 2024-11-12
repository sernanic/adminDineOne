from flask import current_app
from app.services.supabase_service import SupabaseService
from app.dto.item_dto import ItemDTO
from app.models.itemImages import ItemImage
from app import db
class ItemService:
    @staticmethod
    def getItemsByMerchantId(merchantId, clientId):
        items = SupabaseService.getItemsByMerchantId(merchantId, clientId)
        return items

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


