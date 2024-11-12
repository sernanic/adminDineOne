from flask import jsonify, request
from firebase_admin import auth, initialize_app, get_app
from functools import wraps
from app.services.supabase_service import SupabaseService


def firebaseAuthRequired(f):
    @wraps(f)
    def decoratedFunction(*args, **kwargs):
        idToken = request.headers.get('Authorization')
        if not idToken:
            return jsonify({"error": "No token provided"}), 401
        try:
            # Remove 'Bearer ' prefix if present
            if idToken.startswith('Bearer '):
                idToken = idToken.split('Bearer ')[1]
            # Verify the token
            decodedToken = auth.verify_id_token(idToken)
            # Get the UID from the decoded token
            uid = decodedToken['uid']
            # Fetch the user from Supabase using the UID
            user = SupabaseService.getUserByUid(uid)
            if not user:
                return jsonify({"error": "User not found in database"}), 404
            
            # Add user and clientId to the request context
            request.currentUser = user
            request.clientId = user.clientId
            
            return f(*args, **kwargs)
        except Exception as e:
            print("Error verifying token:", str(e))
            return jsonify({"error": "Invalid token"}), 401
    return decoratedFunction

def adminRequired(f):
    @wraps(f)
    def decoratedFunction(*args, **kwargs):
        if not request.currentUser or not request.currentUser.isAdmin:
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decoratedFunction

def supabaseAuthRequired(f):
    @wraps(f)
    def decoratedFunction(*args, **kwargs):
        accessToken = request.headers.get('Authorization')
        if not accessToken:
            return jsonify({"error": "No token provided"}), 401
        try:
            # Remove 'Bearer ' prefix if present
            if accessToken.startswith('Bearer '):
                accessToken = accessToken.split('Bearer ')[1]
            
            # Verify the token and get user data
            userData = SupabaseService.verifyToken(accessToken)
            if not userData:
                return jsonify({"error": "Invalid token"}), 401
            
            # Fetch the user from Supabase using the user ID
            user = SupabaseService.getUserById(userData['user']['id'])
            if not user:
                return jsonify({"error": "User not found in database"}), 404
            
            # Add user and clientId to the request context
            request.currentUser = user
            request.clientId = user.clientId
            
            return f(*args, **kwargs)
        except Exception as e:
            print("Error verifying token:", str(e))
            return jsonify({"error": "Invalid token"}), 401
    return decoratedFunction
