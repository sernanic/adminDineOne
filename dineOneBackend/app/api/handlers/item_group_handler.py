from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired

itemGroupBp = Blueprint('itemGroupBp', __name__)

@itemGroupBp.route('/sync/itemGroups', methods=['POST'])
def syncItemGroups():
    try:
        merchantId = "6JDE8MZSA6FJ1"
        itemGroups = CloverService.fetchItemGroups(merchantId)
        print("itemGroups",itemGroups)
        # for itemGroupData in itemGroups:
        #     SupabaseService.insertOrUpdateItemGroup(itemGroupData, merchantId)

        return jsonify({"message": "Item groups synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@itemGroupBp.route('/itemGroups/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def getItemGroups(merchantId, currentUser, clientId):
    try:
        itemGroups = SupabaseService.getItemGroupsByMerchantId(merchantId, clientId)
        
        # Convert item groups to a list of dictionaries
        itemGroupsData = [{
            'itemGroupId': group.itemGroupId,
            'name': group.name,
            'sortOrder': group.sortOrder,
            'deleted': group.deleted,
            'modifiedTime': group.modifiedTime.isoformat() if group.modifiedTime else None,
            'clientId': group.clientId
        } for group in itemGroups]

        return jsonify({"itemGroups": itemGroupsData}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
