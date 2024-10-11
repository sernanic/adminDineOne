from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebase_auth_required
import json
import logging

modifierBp = Blueprint('modifierBp', __name__)

@modifierBp.route('/sync/modifierGroups', methods=['POST'])
@firebase_auth_required
def syncModifierGroups():
    try:
        merchantId = "6JDE8MZSA6FJ1"
        modifierGroups = CloverService.fetchModifierGroups(merchantId)
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
            'merchantId': group.merchantId
            
        } for group in modifierGroups]

        return jsonify({"modifierGroups": modifierGroupsData}), 200
    except Exception as e:
        print("error", e)
        return jsonify({"error": str(e)}), 500


@modifierBp.route('/sync/modifiers', methods=['POST'])
@firebase_auth_required
def syncModifiers():
    try:
        merchantId = "6JDE8MZSA6FJ1"
        modifiers = CloverService.fetchModifiers(merchantId)
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
    
@modifierBp.route('/modifiers/<merchantId>/modifierGroup/<modifierGroupId>', methods=['GET'])
def getModifiersByModifierGroupId(merchantId, modifierGroupId):
    try:
        modifiers = SupabaseService.getModifiers(merchantId, modifierGroupId)
        
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

@modifierBp.route('/item/<merchantId>/<itemId>/modifierGroups', methods=['GET'])
def getItemModifierGroupsWithModifiers(merchantId, itemId):
    try:
        modifier_groups_raw = CloverService.fetchItemModifierGroups(merchantId, itemId)
        modifier_groups = modifier_groups_raw['modifierGroups']['elements']

        result = []
        for group in modifier_groups:
            group_data = {
                'id': group['id'],
                'name': group['name'],
                'showByDefault': group['showByDefault'],
                'sortOrder': group['sortOrder'],
                'deleted': group['deleted'],
                'items': group['items'],
                'modifiers': []
            }
            # Fetch modifiers for each group
            modifiers_raw = SupabaseService.getModifiersByIds(group['modifierIds'])

            group_data['modifiers'] = [{
                'id': modifier.modifierId,
                'name': modifier.name,
                'price': float(modifier.price) if modifier.price is not None else None,
                'available': modifier.available,
                'modifiedTime': modifier.modifiedTime.isoformat() if modifier.modifiedTime else None,
                'modifierGroupId': modifier.modifierGroupId,
                'deleted': modifier.deleted
            } for modifier in modifiers_raw]
            
            result.append(group_data)

        return jsonify({"modifierGroups": result}), 200

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/merchant/<merchantId>/modifier/<modifierId>', methods=['GET'])
def getModifierById(merchantId, modifierId):
    try:
        modifier = SupabaseService.getModifierById(merchantId, modifierId)
        
        if not modifier:
            return jsonify({"error": "Modifier not found"}), 404
        
        modifierData = {
            'modifierId': modifier.modifierId,
            'merchantId': modifier.merchantId,
            'name': modifier.name,
            'available': modifier.available,
            'price': float(modifier.price),  # Convert Decimal to float for JSON serialization
            'modifiedTime': modifier.modifiedTime.isoformat() if modifier.modifiedTime else None,
            'modifierGroupId': modifier.modifierGroupId,
            'deleted': modifier.deleted
        }

        return jsonify({"modifier": modifierData}), 200
    except Exception as e:
        logging.error(f"Error fetching modifier: {str(e)}")
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/modifier/image', methods=['POST'])
@firebase_auth_required
def addModifierImage():
    try:
        data = request.json
        modifierId = data.get('modifierId')
        imageUrl = data.get('imageURL')

        if not modifierId or not imageUrl:
            return jsonify({"error": "Both modifierId and imageUrl are required"}), 400

        modifierImage = SupabaseService.insertModifierImage(modifierId, imageUrl)
        return jsonify({
            "message": "Modifier image added successfully",
            "modifierImage": {
                "id": modifierImage.id,
                "modifierId": modifierImage.modifierId,
                "imageUrl": modifierImage.imageUrl
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/modifier/<modifierId>/image', methods=['GET'])
def getModifierImage(modifierId):
    try:
        modifierImage = SupabaseService.getModifierImageByModifierId(modifierId)
        
        if modifierImage:
            imageData = {
                'id': modifierImage.id,
                'modifierId': modifierImage.modifierId,
                'imageURL': modifierImage.imageUrl
            }
            return jsonify({"modifierImage": imageData}), 200
        else:
            return jsonify({"modifierImage": None}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/modifier/<modifierId>/image', methods=['PUT'])
@firebase_auth_required
def updateModifierImage(modifierId):
    try:
        data = request.json
        imageUrl = data.get('imageUrl')

        if not imageUrl:
            return jsonify({"error": "imageUrl is required"}), 400

        updatedModifierImage = SupabaseService.updateModifierImage(modifierId, imageUrl)

        if updatedModifierImage:
            imageData = {
                'id': updatedModifierImage.id,
                'modifierId': updatedModifierImage.modifierId,
                'imageUrl': updatedModifierImage.imageUrl
            }
            return jsonify({"message": "Modifier image updated successfully", "modifierImage": imageData}), 200
        else:
            return jsonify({"error": "Modifier image not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500