from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired
from app.services.itemService import ItemService
from app.models.itemImages import ItemImage
import logging
import datetime


item_bp = Blueprint('item_bp', __name__)

@item_bp.route('/sync/items/<merchantId>', methods=['POST'])
@firebaseAuthRequired
def syncItems(merchantId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        items = CloverService.fetchItems(clientId, merchantId)
        for itemData in items:
            SupabaseService.insertOrUpdateItem(itemData, merchantId, clientId)

        return jsonify({"message": "Items synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/items/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def getItems(merchantId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        items = SupabaseService.getItemsByMerchantId(merchantId, clientId)
        itemDTOList = ItemService.convertItemsToDTO(items, merchantId, clientId)

        return jsonify({"items": itemDTOList}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/<merchant_id>/<itemId>', methods=['GET'])
@firebaseAuthRequired
def getItem(merchant_id, itemId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        item = SupabaseService.getItemById(merchant_id, itemId, clientId)
        if item:
            itemData = {
                'itemId': item.itemId,
                'name': item.name,
                'price': item.price,
                'hidden': item.hidden,
                'available': item.available,
                'autoManage': item.auto_manage,
                'priceType': item.price_type,
                'defaultTaxRates': item.default_tax_rates,
                'cost': item.cost,
                'isRevenue': item.is_revenue,
                'modifiedTime': item.modified_time.isoformat() if item.modified_time else None,
                'deleted': item.deleted,
                'merchantId': item.merchant_id,
                'description': item.description,
                'isPopular': item.isPopular
            }
            return jsonify({"item": itemData}), 200
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/<itemId>/images', methods=['POST'])
@firebaseAuthRequired
def addItemImages():
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.json
        itemId = data.get('itemId')
        imageUrls = data.get('imageUrls', [])

        if not itemId or not imageUrls:
            return jsonify({"error": "Both itemId and imageUrls are required"}), 400

        if len(imageUrls) > 6:
            return jsonify({"error": "Maximum 6 images allowed per item"}), 400

        itemImages = SupabaseService.insertItemImage(itemId, imageUrls, clientId)

        return jsonify({
            "message": "Item images added successfully",
            "itemImages": [
                {"id": img.id, "itemId": img.itemId, "imageUrl": img.imageUrl, "sortOrder": img.sortOrder}
                for img in itemImages
            ]
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/<itemId>/images', methods=['GET'])
@firebaseAuthRequired
def getItemImages(itemId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        itemImages = SupabaseService.getItemImagesByItemId(itemId, clientId)
        if itemImages:
            imagesData = [
                {
                    'id': image.id,
                    'itemId': image.itemId,
                    'imageUrl': image.imageURL,
                    'sortOrder': image.sortOrder
                } for image in itemImages
            ]
            return jsonify({"itemImages": imagesData}), 200
        else:
            return jsonify({"itemImages": []}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/image', methods=['POST'])
@firebaseAuthRequired
def addItemImage():
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.json
        itemId = data.get('itemId')
        imageUrl = data.get('imageURL')

        if not itemId or not imageUrl:
            return jsonify({"error": "Both itemId and imageURL are required"}), 400

        itemImage = SupabaseService.insertItemImage(itemId, imageUrl, clientId)

        return jsonify({
            "message": "Item image added successfully",
            "itemImage": {
                "id": itemImage.id,
                "itemId": itemImage.itemId,
                "imageURL": itemImage.imageURL,
                "sortOrder": itemImage.sortOrder
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/image/<int:image_id>', methods=['DELETE'])
@firebaseAuthRequired
def deleteItemImage(imageId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        result = SupabaseService.deleteItemImage(imageId, clientId)
        if result:
            return jsonify({"message": "Item image deleted successfully"}), 200
        else:
            return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/api/item/edit', methods=['POST'])
@firebaseAuthRequired
def createOrUpdateItem():
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.json
        print(data)
        merchantId = data.get('merchantId')
        
        if not merchantId:
            return jsonify({"error": "merchantId is required"}), 400

        # Required fields validation
        required_fields = ['name', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        # Prepare item data
        itemData = {
            'itemId': data.get('itemId'),  # For updates
            'name': data.get('name'),
            'price': data.get('price'),
            'hidden': data.get('hidden', False),
            'available': data.get('available', True),
            'deleted': data.get('deleted', False),
            'description': data.get('description', None),
            'isPopular': data.get('isPopular', False)
        }

        # Create or update the item
        item = SupabaseService.insertOrUpdateItem(itemData, merchantId, clientId)

        # Prepare response data
        responseData = {
            'itemId': item.itemId,
            'name': item.name,
            'price': float(item.price),
            'hidden': item.hidden,
            'available': item.available,
            'autoManage': item.auto_manage,
            'priceType': item.price_type,
            'defaultTaxRates': item.default_tax_rates,
            'cost': float(item.cost) if item.cost else 0,
            'isRevenue': item.is_revenue,
            'modifiedTime': item.modified_time.isoformat() if item.modified_time else None,
            'deleted': item.deleted,
            'merchantId': item.merchant_id,
            'description': item.description,
            'isPopular': item.isPopular
        }

        return jsonify({
            "message": "Item saved successfully",
            "item": responseData
        }), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/api/items/images/reorder', methods=['PUT'])
@firebaseAuthRequired
def updateItemImagesSortOrder():
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        imageUpdates = request.json
        
        # Validate request data
        if not isinstance(imageUpdates, list):
            return jsonify({"error": "Invalid request format"}), 400
            
        for update in imageUpdates:
            if not all(key in update for key in ['id', 'sortOrder']):
                return jsonify({"error": "Missing required fields"}), 400
        
        # Verify all images belong to the client
        imageIds = [update['id'] for update in imageUpdates]
        existingImages = ItemImage.query.filter(
            ItemImage.id.in_(imageIds),
            ItemImage.clientId == clientId
        ).all()
        
        if len(existingImages) != len(imageIds):
            return jsonify({"error": "One or more images not found or unauthorized"}), 404
        
        ItemService.updateItemImagesSortOrder(imageUpdates)
        return jsonify({"message": "Sort order updated successfully"}), 200
        
    except Exception as e:
        logging.error(f"Error in updateItemImagesSortOrder - clientId: {clientId}, error: {str(e)}")
        return jsonify({"error": "Failed to update sort order"}), 500
