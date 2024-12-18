from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.services.cateogoryService import CategoryService
from app.utils.auth_middleware import firebaseAuthRequired


category_bp = Blueprint('category_bp', __name__)

# TODO: make this a bulk insert/update
@category_bp.route('/sync/categories/<merchantId>', methods=['POST'])
@firebaseAuthRequired
def syncCategories(merchantId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        categories = CloverService.fetchCategories(clientId, merchantId)
        
        # Collect all category IDs from Clover
        clover_category_ids = []
        
        for categoryData in categories:
            CategoryService.insertOrUpdateCategory(categoryData, merchantId, clientId)
            categoryId = categoryData.get('id')
            clover_category_ids.append(categoryId)
            items = CloverService.fetchItemsByCategory(clientId, merchantId, categoryId)
            for item in items:
                CategoryService.insertOrUpdateCategoryItem(categoryId, item['id'], clientId)
        
        # Delete categories that don't exist in Clover anymore
        CategoryService.deleteNonExistentCategories(merchantId, clientId, clover_category_ids)
        
        return jsonify({"message": "Categories and items synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_bp.route('/categories/<merchant_id>', methods=['GET'])
@firebaseAuthRequired
def get_categories(merchant_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        categories = CategoryService.getCategoriesByMerchantId(merchant_id, clientId)
        
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
        category = CategoryService.getCategoryById(merchant_id, category_id, clientId)
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

        category_image = CategoryService.insertCategoryImage(category_id, image_url, clientId)

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
        category_image = CategoryService.getCategoryImageByCategoryId(category_id)
        
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

@category_bp.route('/category/<merchantId>/<categoryId>', methods=['PUT'])
@firebaseAuthRequired
def edit_category(merchantId, categoryId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        categoryData = request.json
        
        if not categoryData:
            return jsonify({"error": "Category data is required"}), 400

        updated_category = CategoryService.insertOrUpdateCategory(categoryData, merchantId, clientId)


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



@category_bp.route('/category/image/<category_id>', methods=['DELETE'])
@firebaseAuthRequired
def delete_category_image(category_id):
    try:
        clientId = request.clientId

        if not category_id:
            return jsonify({"error": "Category ID is required"}), 400

        success = CategoryService.deleteCategoryImage(category_id, clientId)

        if success:
            return jsonify({"message": "Category image deleted successfully"}), 200
        else:
            return jsonify({"error": "Category image not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
