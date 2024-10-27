from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired
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

@item_bp.route('/items/<merchant_id>', methods=['GET'])
@firebaseAuthRequired
def getItems(merchant_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        items = SupabaseService.getItemsByMerchantId(merchant_id, clientId)
        # Convert items to a list of dictionaries
        itemsData = [{
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
            'description': item.description
        } for item in items]

        return jsonify({"items": itemsData}), 200
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
                'description': item.description
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
                {"id": img.id, "itemId": img.itemId, "imageUrl": img.imageUrl}
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
                    'imageUrl': image.imageURL
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
                "imageURL": itemImage.imageURL
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
            'description': data.get('description', None)
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
            'description': item.description
        }

        return jsonify({
            "message": "Item saved successfully",
            "item": responseData
        }), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
