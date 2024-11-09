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
