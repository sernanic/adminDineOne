from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebase_auth_required
category_bp = Blueprint('category_bp', __name__)

@category_bp.route('/sync/categories', methods=['POST'])
@firebase_auth_required
def sync_categories():
    try:
        merchant_id = "6JDE8MZSA6FJ1"
        categories = CloverService.fetchCategories(merchant_id)
        for category_data in categories:
            SupabaseService.insert_or_update_category(category_data, merchant_id)

        return jsonify({"message": "Categories synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_bp.route('/categories/<merchant_id>', methods=['GET'])
def get_categories(merchant_id):
    try:
        categories = SupabaseService.getCategoriesByMerchantId(merchant_id)
        
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
def get_category(merchant_id, category_id):
    try:
        print("helllo")
        category = SupabaseService.getCategoryById(merchant_id, category_id)
        print("category", category)
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
def get_items_by_category(merchant_id, category_id):
    try:
        items = CloverService.fetchItemsByCategory(merchant_id, category_id)
        
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
@firebase_auth_required
def add_category_image():
    try:
        data = request.json
        category_id = data.get('categoryId')
        image_url = data.get('imageURL')

        if not category_id or not image_url:
            return jsonify({"error": "Both categoryId and imageURL are required"}), 400

        category_image = SupabaseService.insertCategoryImage(category_id, image_url)

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
def get_category_image(category_id):
    try:
        category_image = SupabaseService.getCategoryImageByCategoryId(category_id)
        
        if category_image:
            image_data = {
                'id': category_image.id,
                'categoryId': category_image.categoryId,
                'imageURL': category_image.imageURL
            }
            return jsonify({"categoryImage": image_data}), 200
        else:
            return None, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/category/<merchant_id>/<category_id>', methods=['PUT'])
@firebase_auth_required
def edit_category(merchant_id, category_id):
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "Category data is required"}), 400

        updated_category = SupabaseService.updateCategory(merchant_id, category_id, data)

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

