from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired
import json
import logging

modifierBp = Blueprint('modifierBp', __name__)

@modifierBp.route('/sync/modifierGroups/<merchantId>', methods=['POST'])
@firebaseAuthRequired
def syncModifierGroups(merchantId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:        
        modifierGroups = CloverService.fetchModifierGroups(clientId, merchantId)
        for modifierGroupData in modifierGroups:
            SupabaseService.insertOrUpdateModifierGroup(modifierGroupData, merchantId, clientId)
        
        modifiers = CloverService.fetchModifiers(clientId, merchantId)
        for modifierData in modifiers:
            SupabaseService.insertOrUpdateModifier(modifierData, merchantId, clientId)
        
        merchantItems = SupabaseService.getItemsByMerchantId(merchantId,clientId)
        for item in merchantItems:
            modifier_groups_raw = CloverService.fetchItemModifierGroups(clientId, merchantId, item.itemId)
            modifier_groups = modifier_groups_raw['modifierGroups']['elements']
            for group in modifier_groups:
                SupabaseService.insertItemModifierGroup(item.itemId,group['id'],clientId)

        return jsonify({"message": "Modifier groups synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@modifierBp.route('/modifierGroups/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def getModifierGroups(merchantId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        modifierGroups = SupabaseService.getModifierGroupsByMerchantId(merchantId, clientId)
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
        return jsonify({"error": str(e)}), 500


@modifierBp.route('/sync/modifiers/<merchantId>', methods=['POST'])
@firebaseAuthRequired
def syncModifiers(merchantId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        modifiers = CloverService.fetchModifiers(clientId, merchantId)
        for modifierData in modifiers:
            SupabaseService.insertOrUpdateModifier(modifierData, merchantId, clientId)

        return jsonify({"message": "Modifier groups synced successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/modifiers/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def getModifiers(merchantId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        modifiers = SupabaseService.getModifiersByMerchantId(merchantId, clientId)
        
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
@firebaseAuthRequired
def getModifiersByModifierGroupId(merchantId, modifierGroupId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        modifiers = SupabaseService.getModifiers(merchantId, modifierGroupId, clientId)
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
    
@modifierBp.route('/item/<itemId>/modifierGroups', methods=['GET'])
@firebaseAuthRequired
def getItemModifierGroupsWithModifiers(itemId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        
        modifierGroups = SupabaseService.getModifierGroupsByItemId(itemId, clientId)

        result = []
        for group in modifierGroups:
            groupData = group.toDict()
            
            modifiersRaw = SupabaseService.getModifiersByModifierGroupId(group.modifierGroupId, clientId)

            groupData['modifiers'] = [{
                'id': modifier.modifierId,
                'name': modifier.name,
                'price': float(modifier.price) if modifier.price is not None else None,
                'available': modifier.available,
                'modifiedTime': modifier.modifiedTime.isoformat() if modifier.modifiedTime else None,
                'modifierGroupId': modifier.modifierGroupId,
                'deleted': modifier.deleted
            } for modifier in modifiersRaw]
            
            result.append(groupData)
        
        logging.info(f"Result: {result}")

        return jsonify({"modifierGroups": result}), 200

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@modifierBp.route('/merchant/<merchantId>/modifier/<modifierId>', methods=['GET'])
@firebaseAuthRequired
def getModifierById(merchantId, modifierId):
    currentUser = request.currentUser
    clientId = request.clientId

    try:
        modifier = SupabaseService.getModifierById(merchantId, modifierId, clientId)
        
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
@firebaseAuthRequired
def addModifierImage():
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        data = request.json
        modifierId = data.get('modifierId')
        imageUrl = data.get('imageURL')

        if not modifierId or not imageUrl:
            return jsonify({"error": "Both modifierId and imageUrl are required"}), 400

        modifierImage = SupabaseService.insertModifierImage(modifierId, imageUrl, clientId)
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
@firebaseAuthRequired
def getModifierImage(modifierId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        modifierImage = SupabaseService.getModifierImageByModifierId(modifierId, clientId)
        
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
@firebaseAuthRequired
def updateModifierImage(modifierId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        data = request.json
        imageUrl = data.get('imageUrl')

        if not imageUrl:
            return jsonify({"error": "imageUrl is required"}), 400

        updatedModifierImage = SupabaseService.updateModifierImage(modifierId, imageUrl, clientId)

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
