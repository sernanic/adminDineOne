from flask import jsonify, request
from firebase_admin import auth, initialize_app, get_app
from functools import wraps
from app.services.supabase_service import SupabaseService
from app.services.customerService import CustomerService
import jwt
import os
import base64
from datetime import datetime


def verify_token(token):
    try:
        # Get the JWT secret from environment variable
        jwt_secret = os.getenv('SUPABASE_JWT_SECRET')
        if not jwt_secret:
            raise ValueError("SUPABASE_JWT_SECRET not configured")
            
        # For Supabase tokens, decode without verification first
        decoded = jwt.decode(token, options={"verify_signature": False})
        
        # Check if token is from our Supabase instance
        expected_issuer = "https://qnvhmkpesjjfuesjvwdf.supabase.co/auth/v1"
        if decoded.get('iss') != expected_issuer:
            print("Invalid token issuer")
            return {
                'error': 'Invalid token issuer',
                'status': 401
            }

        # Convert expiration time to UTC datetime for comparison
        current_time = datetime.utcnow()
        token_exp = datetime.utcfromtimestamp(decoded.get('exp', 0))
        
        # Debug timestamps
        print(f"Current UTC time: {current_time.isoformat()}Z")
        print(f"Token expires at: {token_exp.isoformat()}Z")
        print(f"Time until expiration: {(token_exp - current_time).total_seconds()} seconds")

        if token_exp < current_time:
            time_diff = (current_time - token_exp).total_seconds() / 3600
            print(f"Token expired {time_diff:.2f} hours ago")
            return {
                'error': 'Token expired - needs refresh',
                'status': 401
            }

        # If we get here, token is valid
        return {
            'user': {
                'authUUID': decoded['sub'],
                'email': decoded.get('email'),
                'role': decoded.get('role', 'authenticated'),
                'metadata': decoded.get('user_metadata', {})
            }
        }
    except Exception as e:
        print(f"Error verifying token: {str(e)}")
        return {
            'error': str(e),
            'status': 401
        }
def supabaseAuthRequired(f):
    @wraps(f)
    def decoratedFunction(*args, **kwargs):
        try:
            # Get the authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"error": "No token provided"}), 401
            
            # Extract the token
            accessToken = auth_header.split(' ')[1]
            
            # Verify the token
            result = verify_token(accessToken)
            if 'error' in result:
                return jsonify({"error": result['error']}), result['status']
            
            # If we get here, token is valid
            userData = result['user']
            
            # Fetch the customer using the user ID from token
            customer = CustomerService.getCustomerByAuthUUID(userData['authUUID'])
            if not customer:
                return jsonify({"error": "User not found in database"}), 404
            
            # Add user and clientId to the request context
            request.currentCustomer = customer
            request.clientId = customer.clientId
            request.authUUID = userData['authUUID']
            
            return f(*args, **kwargs)
        except Exception as e:
            print("Error in auth middleware:", str(e))
            return jsonify({"error": "Authentication failed"}), 401
    
    return decoratedFunction
    
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


