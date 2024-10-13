from flask import jsonify, Blueprint, request
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired

userBp = Blueprint('userBp', __name__)

@userBp.route('/user', methods=['POST'])
@firebaseAuthRequired
def createUser():
    try:
        data = request.json
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        isAdmin = data.get('isAdmin', False)

        if not firstName or not lastName:
            return jsonify({"error": "firstName and lastName are required"}), 400

        newUser = SupabaseService.insertUser(firstName, lastName, isAdmin)

        return jsonify({
            "message": "User created successfully",
            "user": newUser.toDict()
        }), 201
    except Exception as e:
        print("Error creating user:", str(e))
        return jsonify({"error": str(e)}), 500

@userBp.route('/user/<int:userId>', methods=['GET'])
@firebaseAuthRequired
def getUser(userId):
    try:
        user = SupabaseService.getUser(userId)
        if user:
            return jsonify(user.toDict()), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print("Error getting user:", str(e))
        return jsonify({"error": str(e)}), 500
