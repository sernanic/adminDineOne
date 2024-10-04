from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebase_auth_required
from app.config.firebase_config import initialize_firebase

# Initialize Firebase
initialize_firebase()

item_bp = Blueprint('item_bp', __name__)

@item_bp.route('/sync/items', methods=['POST'])
@firebase_auth_required
def sync_items():
    try:
        merchant_id = "6JDE8MZSA6FJ1"
        items = CloverService.fetchItems(merchant_id)
        for item_data in items:
            SupabaseService.insert_or_update_item(item_data,merchant_id)

        return jsonify({"message": "Items synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/items/<merchant_id>', methods=['GET'])
def get_items(merchant_id):
    try:
        items = SupabaseService.get_items_by_merchant_id(merchant_id)
        # Convert items to a list of dictionaries
        items_data = [{
            'item_id': item.item_id,
            'name': item.name,
            'price': item.price,
            'hidden': item.hidden,
            'available': item.available,
            'auto_manage': item.auto_manage,
            'price_type': item.price_type,
            'default_tax_rates': item.default_tax_rates,
            'cost': item.cost,
            'is_revenue': item.is_revenue,
            'modified_time': item.modified_time.isoformat() if item.modified_time else None,
            'deleted': item.deleted,
            'merchantId': item.merchant_id
        } for item in items]

        return jsonify({"items": items_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/<merchant_id>/<item_id>', methods=['GET'])
def get_item(merchant_id, item_id):
    try:
        item = SupabaseService.get_item_by_id(merchant_id, item_id)
        
        if item:
            item_data = {
                'item_id': item.item_id,
                'name': item.name,
                'price': item.price,
                'hidden': item.hidden,
                'available': item.available,
                'auto_manage': item.auto_manage,
                'price_type': item.price_type,
                'default_tax_rates': item.default_tax_rates,
                'cost': item.cost,
                'is_revenue': item.is_revenue,
                'modified_time': item.modified_time.isoformat() if item.modified_time else None,
                'deleted': item.deleted
            }
            return jsonify({"item": item_data}), 200
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/<item_id>/images', methods=['POST'])
@firebase_auth_required
def addItemImages():
    try:
        data = request.json
        itemId = data.get('itemId')
        imageUrls = data.get('imageUrls', [])

        if not itemId or not imageUrls:
            return jsonify({"error": "Both itemId and imageUrls are required"}), 400

        if len(imageUrls) > 6:
            return jsonify({"error": "Maximum 6 images allowed per item"}), 400

        itemImages = SupabaseService.insertItemImage(itemId, imageUrls)

        return jsonify({
            "message": "Item images added successfully",
            "itemImages": [
                {"id": img.id, "itemId": img.itemId, "imageUrl": img.imageUrl}
                for img in itemImages
            ]
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/<item_id>/images', methods=['GET'])
def getItemImages(item_id):
    try:
        itemImages = SupabaseService.getItemImagesByItemId(item_id)

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
@firebase_auth_required
def add_item_image():
    try:
        data = request.json
        item_id = data.get('itemId')
        image_url = data.get('imageURL')

        if not item_id or not image_url:
            return jsonify({"error": "Both itemId and imageURL are required"}), 400

        item_image = SupabaseService.insertItemImage(item_id, image_url)

        return jsonify({
            "message": "Item image added successfully",
            "itemImage": {
                "id": item_image.id,
                "itemId": item_image.itemId,
                "imageURL": item_image.imageURL
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route('/item/image/<int:image_id>', methods=['DELETE'])
@firebase_auth_required
def delete_item_image(image_id):
    try:
        result = SupabaseService.deleteItemImage(image_id)
        if result:
            return jsonify({"message": "Item image deleted successfully"}), 200
        else:
            return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

