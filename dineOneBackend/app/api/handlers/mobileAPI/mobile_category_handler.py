from flask import jsonify, Blueprint, request
from app.services.cateogoryService import CategoryService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired
from app.services.cateogoryService import CategoryService

mobileCategoryBp = Blueprint('mobileCategoryBp', __name__)
@mobileCategoryBp.route('/api/<clientId>/categories/<merchantId>', methods=['GET'])
def getCategories(merchantId, clientId):
    try:
        categories = CategoryService.getPublicCategoriesByMerchantId(merchantId)
        categoriesDTOList = []
        for category in categories:
            categoryDTO = CategoryService.getCategoryDTOByCategoryId(category.categoryId, merchantId, clientId)
            if categoryDTO:
                categoriesDTOList.append(categoryDTO.toDict())

        return jsonify({"categories": categoriesDTOList}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
