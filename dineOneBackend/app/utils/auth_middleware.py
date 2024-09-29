from flask import jsonify, request
from firebase_admin import auth
from functools import wraps

def firebase_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = request.headers.get('Authorization')
        if not id_token:
            return jsonify({"error": "No token provided"}), 401
        try:
            # Remove 'Bearer ' prefix if present
            if id_token.startswith('Bearer '):
                id_token = id_token.split('Bearer ')[1]
            # Verify the token
            decoded_token = auth.verify_id_token(id_token)
            # You can access the user's UID with decoded_token['uid']
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": "Invalid token"}), 401
    return decorated_function