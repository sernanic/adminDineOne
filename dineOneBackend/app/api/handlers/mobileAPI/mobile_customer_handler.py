from flask import jsonify, Blueprint, request
from app.services.customerService import CustomerService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import supabaseAuthRequired
import logging

mobileCustomerBp = Blueprint('mobileCustomerBp', __name__)

@mobileCustomerBp.route('/api/v1/client/<clientId>/merchant/<merchantId>/customers', methods=['POST'])
def createCustomer(merchantId, clientId):
    try:
        customerData = request.get_json()
        customer = CustomerService.createCustomer(customerData)
        # customerDTO = CustomerService.convertCustomerToDTO(customer, merchantId, clientId)
        return jsonify({"customer": customer.toDict()}), 201
    except Exception as e:
        logging.error(f"Error in createCustomer - clientId: {clientId}, error: {str(e)}")
        return jsonify({"error": "Failed to create customer"}), 500

@mobileCustomerBp.route('/api/v1/client/<clientId>/merchant/<merchantId>/customers', methods=['GET'])
@supabaseAuthRequired
def getCustomer(merchantId, clientId):
    authUUID = None
    try:
        authUUID = request.authUUID
        
        if not authUUID:
            return jsonify({"error": "authUUID is required"}), 400
            
        customer = CustomerService.getCustomerByAuthUUID(authUUID)
        customerDTO = CustomerService.convertCustomerToDTO(customer)
        if not customer:
            return jsonify({"error": "Customer not found"}), 404
            
        return jsonify({"customer": customerDTO.toDict()}), 200
    except Exception as e:
        logging.error(f"Error in getCustomer - clientId: {clientId}, authUUID: {authUUID}, error: {str(e)}")
        return jsonify({"error": "Failed to fetch customer"}), 500

@mobileCustomerBp.route('/api/v1/client/<clientId>/merchant/<merchantId>/customers/favorites', methods=['POST'])
@supabaseAuthRequired
def addFavoriteItem(merchantId, clientId):
    try:
        data = request.get_json()
        itemId = data.get('itemId')
        authUUID = request.authUUID
        
        if not itemId:
            return jsonify({"error": "itemId required"}), 400
        if not authUUID:
            return jsonify({"error": "authUUID required"}), 400
            
        try:
            favorite = CustomerService.toggleFavoriteItem(itemId, authUUID, clientId)
            return jsonify({
                "favorite": favorite.toDict() if favorite is not None else None,
                "status": "removed" if favorite is None else "added"
            }), 200
        except ValueError as ve:
            # Handle validation errors (item or customer not found)
            return jsonify({"error": str(ve)}), 404
            
    except Exception as e:
        logging.error(f"Error in addFavoriteItem - clientId: {clientId}, error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@mobileCustomerBp.route('/api/v1/client/<clientId>/merchant/<merchantId>/customers/favorites', methods=['GET'])
@supabaseAuthRequired
def getFavoriteItems(merchantId, clientId):
    authUUID = None
    try:
        authUUID = request.authUUID
        
        if not authUUID:
            return jsonify({"error": "authUUID is required"}), 400
            
        favorites = CustomerService.getFavoriteItems(authUUID, clientId)
        return jsonify({
            "favorites": [favorite.toDict() for favorite in favorites]
        }), 200
    except Exception as e:
        logging.error(f"Error in getFavoriteItems - clientId: {clientId}, authUUID: {authUUID}, error: {str(e)}")
        return jsonify({"error": "Failed to fetch favorite items"}), 500
