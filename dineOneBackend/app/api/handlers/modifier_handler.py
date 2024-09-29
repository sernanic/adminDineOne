from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebase_auth_required
modifierBp = Blueprint('modifierBp', __name__)

@modifierBp.route('/sync/modifierGroups', methods=['POST'])
@firebase_auth_required
def syncModifierGroups():
    try:
        merchantId = "6JDE8MZSA6FJ1"
        modifierGroups = CloverService.fetchModifierGroups(merchantId)
        print("modifierGroups", modifierGroups)
        for modifierGroupData in modifierGroups:
            SupabaseService.insertOrUpdateModifierGroup(modifierGroupData, merchantId)

        return jsonify({"message": "Modifier groups synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/modifierGroups/<merchantId>', methods=['GET'])
def getModifierGroups(merchantId):
    try:
        modifierGroups = SupabaseService.getModifierGroupsByMerchantId(merchantId)
        
        modifierGroupsData = [{
            'id': group.modifierGroupId,
            'modifierGroupId': group.modifierGroupId,
            'name': group.name,
            'sortOrder': group.sortOrder,
            'deleted': group.deleted,
            'modifiedTime': group.modifiedTime.isoformat() if group.modifiedTime else None,
        } for group in modifierGroups]

        return jsonify({"modifierGroups": modifierGroupsData}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/sync/modifiers', methods=['POST'])
@firebase_auth_required
def syncModifiers():
    try:
        merchantId = "6JDE8MZSA6FJ1"
        modifiers = CloverService.fetchModifiers(merchantId)
        print("modifierGroups", modifiers)
        for modifierData in modifiers:
            SupabaseService.insertOrUpdateModifier(modifierData, merchantId)

        return jsonify({"message": "Modifier groups synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/modifiers/<merchantId>', methods=['GET'])
def getModifiers(merchantId):
    try:
        modifiers = SupabaseService.getModifiersByMerchantId(merchantId)
        
        # Convert modifiers to a list of dictionaries
        modifiersData = [{
            'modifierId': modifier.modifierId,
            'merchantId': modifier.merchantId,
            'name': modifier.name,
            'available': modifier.available,
            'price': float(modifier.price),  # Convert Decimal to float for JSON serialization
            'modifiedTime': modifier.modifiedTime.isoformat() if modifier.modifiedTime else None,
            'modifierGroupId': modifier.modifierGroupId,
            'deleted': modifier.deleted
        } for modifier in modifiers]

        return jsonify({"modifiers": modifiersData}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500