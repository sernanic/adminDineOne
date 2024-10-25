from flask import jsonify, Blueprint, request
from app.services.cateogoryService import CategoryService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired

mobileModifierBp = Blueprint('mobileModifierBp', __name__)


@mobileModifierBp.route('/api/client/<clientId>/modifierGroup/<modifierGroupId>', methods=['GET'])
def getItemModifierGroupsWithModifiers(clientId, modifierGroupId):
    try:
        mofifierGroupDTO = SupabaseService.getModifierGroupDTO(clientId, modifierGroupId)

        return jsonify({"modifierGroups": mofifierGroupDTO.toDict()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@mobileModifierBp.route('/api/client/<clientId>/item/<itemId>/modifierGroups', methods=['GET'])
def getItemModifierGroups(clientId, itemId):
    try:
        modifierGroupDTOs = SupabaseService.getModifierGroupDTOsByItemId(itemId, clientId)

        return jsonify({"modifierGroups": modifierGroupDTOs}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
