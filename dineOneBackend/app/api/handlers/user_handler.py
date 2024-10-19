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

        if not firstName or not lastName:
            return jsonify({"error": "firstName, lastName, qnd email are required"}), 400
        
        newUser = SupabaseService.insertUser(clientId, firstName, lastName, email, activationCode, isActive, isAdmin, uid)

        return jsonify({
            "message": "User created successfully",
            "user": newUser.toDict()
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@userBp.route('/user/<string:uid>/view', methods=['GET'])
@firebaseAuthRequired
def getUser(uid):
    try:
        user = SupabaseService.getUserByUid(uid)
        if user:
            return jsonify(user.toDict()), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@userBp.route('/users/list', methods=['GET'])
@firebaseAuthRequired
def getAllUsers():
    try:
        clientId = request.clientId
        users = SupabaseService.getUsers(clientId)
        return jsonify([user.toDict() for user in users]), 200
    except Exception as e:
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
        return jsonify({"error": str(e)}), 500

@userBp.route('/user/<string:uid>/edit', methods=['PUT'])
@firebaseAuthRequired
def editUser(uid):
    try:
        data = request.json
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        email = data.get('email')

        if not all([firstName, lastName, email]):
            return jsonify({"error": "firstName, lastName, and email are required"}), 400

        user = SupabaseService.getUserByUid(uid)
        if not user:
            return jsonify({"error": "User not found"}), 404

        updatedUser = SupabaseService.updateUser(user, firstName, lastName, email)

        return jsonify({
            "message": "User updated successfully",
            "user": updatedUser.toDict()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@userBp.route('/user/<string:uid>/updateAvatar', methods=['PUT'])
@firebaseAuthRequired
def updateUserAvatar(uid):
    try:
        data = request.json
        print("data", data)
        avatarUrl = data.get('avatarUrl')

        if not avatarUrl:
            return jsonify({"error": "avatarUrl is required"}), 400

        user = SupabaseService.getUserByUid(uid)
        if not user:
            return jsonify({"error": "User not found"}), 404

        updatedUser = SupabaseService.updateUserAvatarUrl(user, avatarUrl)

        return jsonify({
            "message": "User avatar updated successfully",
            "user": updatedUser.toDict()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
