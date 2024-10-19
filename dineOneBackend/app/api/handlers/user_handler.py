from flask import jsonify, Blueprint, request
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired,adminRequired
import random

userBp = Blueprint('userBp', __name__)

@userBp.route('/user/add', methods=['POST'])
@firebaseAuthRequired
@adminRequired
def createUser():
    try:
        clientId = request.clientId
        currentUser = request.currentUser
        data = request.json
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        isAdmin = data.get('isAdmin', False)
        email = data.get('email')
        activationCode = str(random.randint(100000, 999999))
        isActive = False
        uid = data.get('uid')
        print(firstName, lastName, email, isAdmin)

        if not firstName or not lastName:
            return jsonify({"error": "firstName, lastName, email, and password are required"}), 400
        
        newUser = SupabaseService.insertUser(clientId, firstName, lastName, email, activationCode, isActive, isAdmin, uid)

        return jsonify({
            "message": "User created successfully",
            "user": newUser.toDict()
        }), 201
    except Exception as e:
        print("Error creating user:", str(e))
        return jsonify({"error": str(e)}), 500

@userBp.route('/user/<int:userId>/view', methods=['GET'])
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

@userBp.route('/users/list', methods=['GET'])
@firebaseAuthRequired
def getAllUsers():
    try:
        clientId = request.clientId
        users = SupabaseService.getUsers(clientId)
        return jsonify([user.toDict() for user in users]), 200
    except Exception as e:
        print("Error getting all users:", str(e))
        return jsonify({"error": str(e)}), 500

@userBp.route('/user/activation', methods=['POST'])
def activateUser():
    try:
        data = request.json
        email = data.get('email')
        activationCode = data.get('activationCode')
        uid = data.get('uid') # this is the firebase uid

        if not all([email, activationCode, uid]):
            return jsonify({"error": "Missing required fields"}), 400

        user = SupabaseService.getUserByActivationCode(activationCode)
        
        if not user:
            return jsonify({"error": "Invalid activation code or user already activated"}), 404

        activatedUser = SupabaseService.activateUser(user, email, uid)

        return jsonify({
            "message": "User activated successfully",
            "user": activatedUser.toDict()
        }), 200
    except Exception as e:
        print("Error activating user:", str(e))
        return jsonify({"error": str(e)}), 500
