from flask import jsonify, Blueprint, request
from app.services.itemService import ItemService
from app.services.supabase_service import SupabaseService
import logging

mobileItemBp = Blueprint('mobileItemBp', __name__)

@mobileItemBp.route('/api/<clientId>/items/<merchantId>', methods=['GET'])
def getItems(merchantId, clientId):
    try:
        items = SupabaseService.getItemsByMerchantId(merchantId, clientId)
        itemDTOList = ItemService.convertItemsToDTO(items, merchantId, clientId)
        return jsonify({"items": itemDTOList}), 200
    except Exception as e:
        logging.error(f"Error in getItems - merchantId: {merchantId}, clientId: {clientId}, error: {str(e)}")
        return jsonify({"error": "Failed to fetch items"}), 500
    
@mobileItemBp.route('/api/<clientId>/items/popular/<merchantId>', methods=['GET'])
def getPopularItems(clientId, merchantId):
    try:
        items = SupabaseService.getPopularItemsByMerchantId(merchantId, clientId)
        itemDTOList = ItemService.convertItemsToDTO(items, merchantId, clientId)
        return jsonify({"items": itemDTOList}), 200
    except Exception as e:
        logging.error(f"Error in getPopularItems - merchantId: {merchantId}, clientId: {clientId}, error: {str(e)}")
        return jsonify({"error": "Failed to fetch popular items"}), 500
