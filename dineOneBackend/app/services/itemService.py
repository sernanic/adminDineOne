from flask import current_app
from app.services.supabase_service import SupabaseService
from app.dto.item_dto import ItemDTO

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


