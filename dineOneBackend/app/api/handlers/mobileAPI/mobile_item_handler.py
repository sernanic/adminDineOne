from flask import jsonify, Blueprint, request
from app.services.itemService import ItemService
from app.services.supabase_service import SupabaseService

mobileItemBp = Blueprint('mobileItemBp', __name__)

@mobileItemBp.route('/api/<clientId>/items/<merchantId>', methods=['GET'])
def getItems(merchantId, clientId):
    try:
        items = SupabaseService.getItemsByMerchantId(merchantId, clientId)
        itemDTOList = []
        for item in items:
            itemDTO = ItemService.getItemDTOByItemId(item.itemId, merchantId, clientId)
            if itemDTO:
                itemDTOList.append(itemDTO.toDict())
                
        return jsonify({"items": itemDTOList}), 200
    except Exception as e:
        print(f"Error in getItems: {str(e)}")
        return jsonify({"error": str(e)}), 500
