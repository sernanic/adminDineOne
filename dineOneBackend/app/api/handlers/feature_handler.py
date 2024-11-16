from flask import jsonify, Blueprint, request
from app.utils.auth_middleware import firebaseAuthRequired
from app.services.featureService import FeatureService
import logging

feature_bp = Blueprint('feature_bp', __name__)

@feature_bp.route('/features/', methods=['POST'])
@firebaseAuthRequired
def create_feature():
    """Create a new feature"""
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.get_json()
        required_fields = ['name', 'imageURL', 'description', 'merchantId']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        data['clientId'] = clientId
        feature = FeatureService.create_feature(data)
        return jsonify({"success": True, "data": feature.to_dict()}), 201

    except Exception as e:
        logging.error(f"Error creating feature: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@feature_bp.route('/features/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def get_features(merchantId):
    """Get all features for a merchant"""
    currentUser = request.currentUser
    clientId = request.clientId

    if not merchantId:
        return jsonify({"error": "merchantId is required"}), 400

    try:
        features = FeatureService.get_features(clientId, merchantId)
        return jsonify({
            "success": True,
            "data": {
                "features": [feature.to_dict() for feature in features]
            }
        }), 200

    except Exception as e:
        logging.error(f"Error fetching features: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@feature_bp.route('/features/<int:id>', methods=['PUT'])
@firebaseAuthRequired
def update_feature(id):
    """Update an existing feature"""
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.get_json()
        feature = FeatureService.get_feature(id)
        
        # Verify ownership
        if feature.clientId != clientId:
            return jsonify({"error": "Unauthorized"}), 403

        updated_feature = FeatureService.update_feature(id, data)
        return jsonify({
            "success": True,
            "data": updated_feature.to_dict()
        }), 200

    except Exception as e:
        logging.error(f"Error updating feature: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@feature_bp.route('/features/<int:id>', methods=['DELETE'])
@firebaseAuthRequired
def delete_feature(id):
    """Delete a feature"""
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        feature = FeatureService.get_feature(id)
        
        # Verify ownership
        if feature.clientId != clientId:
            return jsonify({"error": "Unauthorized"}), 403

        FeatureService.delete_feature(id)
        return jsonify({
            "success": True,
            "message": "Feature deleted successfully"
        }), 200

    except Exception as e:
        logging.error(f"Error deleting feature: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
