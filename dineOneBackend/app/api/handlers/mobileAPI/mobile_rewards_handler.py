from flask import jsonify, Blueprint, request
from app.utils.auth_middleware import firebaseAuthRequired
from app.services.rewardService import RewardService
import logging

mobile_reward_bp = Blueprint('mobile_reward_bp', __name__)

@mobile_reward_bp.route('/api/client/<clientId>/rewards/<merchantId>', methods=['GET'])
def get_mobile_rewards(clientId, merchantId):
    """Get all rewards for a merchant in mobile format"""


    if not merchantId:
        return jsonify({"error": "merchantId is required"}), 400

    try:
        rewards = RewardService.get_rewards(clientId, merchantId)
        return jsonify({
            "success": True,
            "data": {
                "rewards": [reward.to_dict() for reward in rewards]
            }
        }), 200

    except Exception as e:
        logging.error(f"Error fetching mobile rewards: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500