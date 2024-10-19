from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired


category_bp = Blueprint('category_bp', __name__)

@category_bp.route('/sync/categories/<merchantId>', methods=['POST'])
@firebaseAuthRequired
def sync_categories(merchantId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        categories = CloverService.fetchCategories(clientId, merchantId)
        for category_data in categories:
            SupabaseService.insert_or_update_category(category_data, merchantId, clientId)

        return jsonify({"message": "Categories synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_bp.route('/categories/<merchant_id>', methods=['GET'])
@firebaseAuthRequired
def get_categories(merchant_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        categories = SupabaseService.getCategoriesByMerchantId(merchant_id, clientId)
        
        # Convert categories to a list of dictionaries
        categories_data = [{
            'categoryId': category.categoryId,
            'name': category.name,
            'sortOrder': category.sortOrder,
            'deleted': category.deleted,
            'merchantId': category.merchantId
        } for category in categories]

        return jsonify({"categories": categories_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_bp.route('/category/<merchant_id>/<category_id>', methods=['GET'])
@firebaseAuthRequired
def get_category(merchant_id, category_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        category = SupabaseService.getCategoryById(merchant_id, category_id, clientId)
        if category:
            category_data = {
                'categoryId': category.categoryId,
                'name': category.name,
                'sortOrder': category.sortOrder,
                'deleted': category.deleted
            }
            return jsonify({"category": category_data}), 200
        else:
            return jsonify({"error": "Category not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_bp.route('/category/<merchant_id>/<category_id>/items', methods=['GET'])
@firebaseAuthRequired
def get_items_by_category(merchant_id, category_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        items = CloverService.fetchItemsByCategory(clientId, merchant_id, category_id)
        
        items_data = [{
            'id': item.get('id'),
            'name': item.get('name'),
            'price': item.get('price'),
            'priceType': item.get('priceType'),
            'defaultTaxRates': item.get('defaultTaxRates'),
            'unitName': item.get('unitName'),
            'code': item.get('code'),
            'sku': item.get('sku')
        } for item in items]

        return jsonify({"items": items_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/category/image', methods=['POST'])
@firebaseAuthRequired
def add_category_image():
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        data = request.json
        category_id = data.get('categoryId')
        image_url = data.get('imageURL')

        if not category_id or not image_url:
            return jsonify({"error": "Both categoryId and imageURL are required"}), 400

        category_image = SupabaseService.insertCategoryImage(category_id, image_url, clientId)

        return jsonify({
            "message": "Category image added successfully",
            "categoryImage": {
                "id": category_image.id,
                "categoryId": category_image.categoryId,
                "imageURL": category_image.imageURL
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/category/<category_id>/image', methods=['GET'])
@firebaseAuthRequired
def get_category_image(category_id):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        category_image = SupabaseService.getCategoryImageByCategoryId(category_id)
        
        if category_image:
            image_data = {
                'id': category_image.id,
                'categoryId': category_image.categoryId,
                'imageURL': category_image.imageURL
            }
            return jsonify({"categoryImage": image_data}), 200
        else:
            return jsonify({}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/category/<merchant_id>/<category_id>', methods=['PUT'])
@firebaseAuthRequired
def edit_category(merchant_id, category_id):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        data = request.json
        
        if not data:
            return jsonify({"error": "Category data is required"}), 400

        updated_category = SupabaseService.updateCategory(merchant_id, category_id, data, clientId)

        if updated_category:
            category_data = {
                'categoryId': updated_category.categoryId,
                'name': updated_category.name,
                'sortOrder': updated_category.sortOrder,
                'deleted': updated_category.deleted
                # Add any other fields that might be part of the category object
            }
            return jsonify({"message": "Category updated successfully", "category": category_data}), 200
        else:
            return jsonify({"error": "Category not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

