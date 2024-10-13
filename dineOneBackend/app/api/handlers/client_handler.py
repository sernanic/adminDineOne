from flask import jsonify, Blueprint, request
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired

clientBp = Blueprint('clientBp', __name__)

@clientBp.route('/client', methods=['POST'])
def createClient():
    try:
        data = request.json
        restaurantName = data.get('restaurantName')
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        uid = data.get('uid')
        if not restaurantName or not firstName or not lastName:
            return jsonify({"error": "restaurantName, firstName, and lastName are required"}), 400

        newClient = SupabaseService.insertClient(restaurantName)

        # Create a user with admin privileges for the new client
        print("newClient.clientId", newClient.clientId)
        newUser = SupabaseService.insertUser(newClient.clientId, firstName, lastName,True,uid)

        return jsonify({
            "client": {
                "id": newClient.clientId,
                "restaurantName": newClient.name
            },
            "user": {
                "id": newUser.userId,
                "firstName": newUser.firstName,
                "lastName": newUser.lastName,
                "isAdmin": newUser.isAdmin
            }
        }), 201
    except Exception as e:
        print("Error creating client and user:", str(e))
        return jsonify({"error": str(e)}), 500
