from flask import jsonify, Blueprint, request
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired
import logging
from app.models.merchant import Merchant

merchantBp = Blueprint('merchantBp', __name__)

@merchantBp.route('/merchants', methods=['GET'])
@firebaseAuthRequired
def getMerchants():
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        merchants = SupabaseService.getMerchants(clientId)
        merchantsData = []
        
        for merchant in merchants:
            # Get the associated address for each merchant
            address = SupabaseService.getMerchantAddress(merchant.merchantId, clientId)
            
            merchant_data = {
                'merchantId': merchant.merchantId,
                'name': merchant.name,
                'location': address.get_location() if address else None
            }
            merchantsData.append(merchant_data)

        return jsonify({"merchants": merchantsData}), 200
    except Exception as e:
        logging.error(f"Error fetching merchants: {str(e)}")
        return jsonify({"error": str(e)}), 500

@merchantBp.route('/merchant/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def getMerchantById(merchantId):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        merchant = SupabaseService.getMerchantById(merchantId, clientId)
        if not merchant:
            return jsonify({"error": "Merchant not found"}), 404
        
        # Get the associated address
        address = SupabaseService.getMerchantAddress(merchantId, clientId)
        print(address)
        merchantData = {
            'merchantId': merchant.merchantId,
            'name': merchant.name,
            'location': address.get_location() if address else None
        }

        return jsonify({"merchant": merchantData}), 200
    except Exception as e:
        logging.error(f"Error fetching merchant: {str(e)}")
        return jsonify({"error": str(e)}), 500

@merchantBp.route('/merchant/add', methods=['POST'])
@firebaseAuthRequired
def addMerchant():
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.json
        requiredFields = ['name', 'merchantId', 'location']
        
        if not all(field in data for field in requiredFields):
            return jsonify({"error": "Missing required fields"}), 400
        
        location_data = data['location']
        required_location_fields = ['address', 'city', 'state', 'country', 'postalCode', 'coordinates']
        if not all(field in location_data for field in required_location_fields):
            return jsonify({"error": "Missing required location fields"}), 400
        
        # First create the address with merchant and client IDs
        address = SupabaseService.addAddress(
            address_data=location_data,
            merchant_id=data['merchantId'],
            client_id=clientId
        )
        
        # Then create the merchant with the address
        merchant = SupabaseService.addMerchantWithAddress(data, address, clientId)
        
        response_data = {
            'merchant': {
                'merchantId': merchant.merchantId,
                'name': merchant.name,
                'location': address.get_location()
            }
        }
        
        return jsonify(response_data), 201
    except Exception as e:
        logging.error(f"Error adding merchant: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@merchantBp.route('/merchant/address/<int:address_id>', methods=['PUT'])
@firebaseAuthRequired
def updateAddress(address_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.json
        required_fields = ['location']
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
            
        location_data = data['location']
        
        # Update the address
        updated_address = SupabaseService.updateAddress(
            address_id=address_id,
            address_data=location_data,
            client_id=clientId
        )
        
        response_data = {
            'address': updated_address.to_dict()
        }
        
        return jsonify(response_data), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        logging.error(f"Error updating address: {str(e)}")
        return jsonify({"error": str(e)}), 500

@merchantBp.route('/merchant/address/<int:address_id>', methods=['DELETE'])
@firebaseAuthRequired
def deleteAddress(address_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        # Delete the address
        SupabaseService.deleteAddress(address_id, clientId)
        return jsonify({"message": "Address deleted successfully"}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        logging.error(f"Error deleting address: {str(e)}")
        return jsonify({"error": str(e)}), 500

@merchantBp.route('/merchant/address/<int:address_id>', methods=['GET'])
@firebaseAuthRequired
def getAddress(address_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        # Get the address
        address = SupabaseService.getAddress(address_id, clientId)
        return jsonify({"address": address.to_dict()}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        logging.error(f"Error retrieving address: {str(e)}")
        return jsonify({"error": str(e)}), 500

@merchantBp.route('/merchant/<merchant_id>', methods=['PUT'])
@firebaseAuthRequired
def updateMerchant(merchant_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        data = request.json
        
        # Update merchant and its address
        merchant, address = SupabaseService.updateMerchantAndAddress(
            merchant_id=merchant_id,
            data=data,
            client_id=clientId
        )
        
        response_data = {
            'merchant': {
                'merchantId': merchant.merchantId,
                'name': merchant.name,
                'location': address.get_location()
            }
        }
        
        return jsonify(response_data), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        logging.error(f"Error updating merchant: {str(e)}")
        return jsonify({"error": str(e)}), 500

@merchantBp.route('/merchant/<merchant_id>', methods=['DELETE'])
@firebaseAuthRequired
def deleteMerchant(merchant_id):
    currentUser = request.currentUser
    clientId = request.clientId
    try:
        # Delete merchant and its address
        SupabaseService.deleteMerchantAndAddress(merchant_id, clientId)
        return jsonify({"message": "Merchant and associated address deleted successfully"}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        logging.error(f"Error deleting merchant: {str(e)}")
        return jsonify({"error": str(e)}), 500
