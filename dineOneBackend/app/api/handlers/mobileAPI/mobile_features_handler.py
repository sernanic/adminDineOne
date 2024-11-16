from flask import jsonify, Blueprint, request
from app.services.featureService import FeatureService
import logging

mobile_feature_bp = Blueprint('mobile_feature_bp', __name__)

@mobile_feature_bp.route('/api/client/<clientId>/features/<merchantId>', methods=['GET'])
def get_mobile_features(clientId, merchantId):
    """Get all features for a merchant in mobile format"""
    try:
        features = FeatureService.get_features(int(clientId), merchantId)
        return jsonify({
            "success": True,
            "data": {
                "features": [feature.to_dict() for feature in features]
            }
        }), 200

    except Exception as e:
        logging.error(f"Error fetching mobile features: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
