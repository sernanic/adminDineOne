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
        merchantsData = [{
            'merchantId': merchant.merchantId,
            'name': merchant.name,
            'address': merchant.address,
            'city': merchant.city,
            'state': merchant.state
        } for merchant in merchants]

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
        
        merchantData = {
            'merchantId': merchant.merchantId,
            'name': merchant.name,
            'address': merchant.address,
            'city': merchant.city,
            'state': merchant.state
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
        requiredFields = ['name', 'address', 'city', 'state', 'merchantId']
        
        if not all(field in data for field in requiredFields):
            return jsonify({"error": "Missing required fields"}), 400
        
        newMerchant = Merchant(
            clientId=clientId,
            name=data['name'],
            address=data['address'],
            city=data['city'],
            state=data['state'],
            merchantId=data['merchantId']
        )
        
        addedMerchant = SupabaseService.addMerchant(newMerchant)
        
        merchantData = {
            'merchantId': addedMerchant.merchantId,
            'name': addedMerchant.name,
            'address': addedMerchant.address,
            'city': addedMerchant.city,
            'state': addedMerchant.state,
            'merchantId': addedMerchant.merchantId
        }
        
        return jsonify({"merchant": merchantData}), 201
    except Exception as e:
        logging.error(f"Error adding merchant: {str(e)}")
        return jsonify({"error": str(e)}), 500
