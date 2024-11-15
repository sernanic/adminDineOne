from flask import jsonify, Blueprint, request
from app.utils.auth_middleware import firebaseAuthRequired
from app.services.rewardService import RewardService
import logging

reward_bp = Blueprint('reward_bp', __name__)

@reward_bp.route('/rewards/', methods=['POST'])
@firebaseAuthRequired
def create_reward():
    """Create a new reward"""
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.get_json()
        required_fields = ['rewardName', 'pointsRequired', 'merchantId']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        if data['pointsRequired'] <= 0:
            return jsonify({"error": "pointsRequired must be a positive integer"}), 400

        data['clientId'] = clientId
        reward = RewardService.create_reward(data)
        return jsonify(reward.to_dict()), 201

    except Exception as e:
        logging.error(f"Error creating reward: {str(e)}")
        return jsonify({"error": str(e)}), 500

@reward_bp.route('/rewards/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def get_rewards(merchantId):
    """Get all rewards for a merchant"""
    currentUser = request.currentUser
    clientId = request.clientId
    

    if not merchantId:
        return jsonify({"error": "merchantId is required"}), 400

    try:
        rewards = RewardService.get_rewards(clientId, merchantId)
        return jsonify({
            "rewards": [reward.to_dict() for reward in rewards]
        }), 200

    except Exception as e:
        logging.error(f"Error fetching rewards: {str(e)}")
        return jsonify({"error": str(e)}), 500

@reward_bp.route('/rewards/<int:id>', methods=['PUT'])
@firebaseAuthRequired
def update_reward(id):
    """Update an existing reward"""
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.get_json()
        if 'pointsRequired' in data and data['pointsRequired'] <= 0:
            return jsonify({"error": "pointsRequired must be a positive integer"}), 400

        # Verify reward belongs to the client
        reward = RewardService.get_reward(id)
        if not reward:
            return jsonify({"error": "Reward not found"}), 404
        if reward.clientId != clientId:
            return jsonify({"error": "Unauthorized"}), 401

        updated_reward = RewardService.update_reward(id, data)
        if not updated_reward:
            return jsonify({"error": "Reward not found"}), 404

        return jsonify(updated_reward.to_dict()), 200

    except Exception as e:
        logging.error(f"Error updating reward: {str(e)}")
        return jsonify({"error": str(e)}), 500

@reward_bp.route('/rewards/<int:id>', methods=['DELETE'])
@firebaseAuthRequired
def delete_reward(id):
    """Delete a reward"""
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        # Verify reward belongs to the client
        reward = RewardService.get_reward(id)
        if not reward:
            return jsonify({"error": "Reward not found"}), 404
        if reward.clientId != clientId:
            return jsonify({"error": "Unauthorized"}), 401

        success = RewardService.delete_reward(id)
        if not success:
            return jsonify({"error": "Reward not found"}), 404

        return jsonify({"message": "Reward deleted successfully"}), 200

    except Exception as e:
        logging.error(f"Error deleting reward: {str(e)}")
        return jsonify({"error": str(e)}), 500
