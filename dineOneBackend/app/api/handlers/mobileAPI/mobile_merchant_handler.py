from flask import jsonify, Blueprint, request
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired
import logging

mobileMerchantBp = Blueprint('mobileMerchantBp', __name__)

@mobileMerchantBp.route('/api/<clientId>/merchants', methods=['GET'])
def getMerchants(clientId):
    try:
        merchants = SupabaseService.getMerchants(clientId)
        merchantsData = []
        
        for merchant in merchants:
            # Get the associated address for each merchant
            address = SupabaseService.getMerchantAddress(merchant.merchantId, clientId)
            
            merchant_data = {
                'merchantId': merchant.merchantId,
                'name': merchant.name,
                'location': address.get_location() if address else None,
                'imageUrl': merchant.imageUrl
            }
            merchantsData.append(merchant_data)

        return jsonify({"merchants": merchantsData}), 200
    except Exception as e:
        logging.error(f"Error fetching merchants: {str(e)}")
        return jsonify({"error": str(e)}), 500
