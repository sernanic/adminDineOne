from flask import jsonify, Blueprint, request
from app.services.customerService import CustomerService
from app.services.supabase_service import SupabaseService
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
def getCustomer(merchantId, clientId):
    authUUID = None
    try:
        authUUID = request.args.get('authUUID')
        
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
def addFavoriteItem(merchantId, clientId):
    try:
        data = request.get_json()
        itemId = data.get('itemId')
        authUUID = data.get('authUUID')
        
        if not itemId:
            return jsonify({"error": "itemId required"}), 400
        if not authUUID:
            return jsonify({"error": "authUUID required"}), 400
            
        favorite = CustomerService.toggleFavoriteItem(itemId, authUUID, clientId)
        return jsonify({
            "favorite": favorite.toDict() if favorite is not None else None
        }), 201
    except Exception as e:
        logging.error(f"Error in addFavoriteItem - clientId: {clientId}, error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@mobileCustomerBp.route('/api/v1/client/<clientId>/merchant/<merchantId>/customers/favorites', methods=['GET'])
def getFavoriteItems(merchantId, clientId):
    authUUID = None
    try:
        authUUID = request.args.get('authUUID')
        
        if not authUUID:
            return jsonify({"error": "authUUID is required"}), 400
            
        favorites = CustomerService.getFavoriteItems(authUUID, clientId)
        return jsonify({
            "favorites": [favorite.toDict() for favorite in favorites]
        }), 200
    except Exception as e:
        logging.error(f"Error in getFavoriteItems - clientId: {clientId}, authUUID: {authUUID}, error: {str(e)}")
        return jsonify({"error": "Failed to fetch favorite items"}), 500
