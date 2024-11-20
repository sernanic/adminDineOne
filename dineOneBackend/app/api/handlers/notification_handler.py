from flask import jsonify, Blueprint, request
from app.utils.auth_middleware import firebaseAuthRequired
from app.services.notificationService import NotificationService
import logging

notification_bp = Blueprint('notification_bp', __name__, url_prefix='')

@notification_bp.route('/notifications/', methods=['POST'])
@firebaseAuthRequired
def create_notification():
    """Create a new notification"""
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.get_json()
        required_fields = ['header', 'body', 'merchantId']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        data['clientId'] = clientId
        notification = NotificationService.create_notification(data)
        return jsonify({"success": True, "data": notification.to_dict()}), 201

    except Exception as e:
        logging.error(f"Error creating notification: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@notification_bp.route('/notifications/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def get_notifications(merchantId):
    """Get all notifications for a merchant"""
    clientId = request.clientId
    try:
        notifications = NotificationService.get_notifications(clientId, merchantId)
        return jsonify({
            "success": True,
            "data": [notification.to_dict() for notification in notifications]
        }), 200
    except Exception as e:
        logging.error(f"Error getting notifications: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@notification_bp.route('/notifications/<int:id>', methods=['PUT'])
@firebaseAuthRequired
def update_notification(id):
    """Update an existing notification"""
    try:
        data = request.get_json()
        notification = NotificationService.update_notification(id, data)
        return jsonify({"success": True, "data": notification.to_dict()}), 200
    except Exception as e:
        logging.error(f"Error updating notification: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@notification_bp.route('/notifications/<int:id>', methods=['DELETE'])
@firebaseAuthRequired
def delete_notification(id):
    """Delete a notification"""
    try:
        NotificationService.delete_notification(id)
        return jsonify({"success": True, "message": "Notification deleted"}), 200
    except Exception as e:
        logging.error(f"Error deleting notification: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
