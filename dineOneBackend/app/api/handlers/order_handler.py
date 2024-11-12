from flask import jsonify, Blueprint, request
from app.services.paymentService import PaymentService
from app.utils.auth_middleware import firebaseAuthRequired
import logging

orderBp = Blueprint('orderBp', __name__)

@orderBp.route('/orders/<merchantId>', methods=['GET'])
@firebaseAuthRequired
def getOrders(merchantId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        
        paymentService = PaymentService()
        orders = paymentService.getOrders(clientId, merchantId)
        
        return jsonify({"orders": orders}), 200
    except Exception as e:
        logging.error(f"Error fetching orders: {str(e)}")
        return jsonify({"error": str(e)}), 500

@orderBp.route('/orders/<orderId>/lineItems', methods=['GET'])
@firebaseAuthRequired
def getOrderLineItems(orderId):
    try:
        currentUser = request.currentUser
        clientId = request.clientId
        
        paymentService = PaymentService()
        lineItems = paymentService.getLineItems(clientId, orderId)
        
        return jsonify({"lineItems": lineItems}), 200
    except Exception as e:
        logging.error(f"Error fetching line items: {str(e)}")
        return jsonify({"error": str(e)}), 500
