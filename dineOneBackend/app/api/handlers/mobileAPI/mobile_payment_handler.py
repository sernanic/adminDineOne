from flask import jsonify, Blueprint, request, render_template
from app.utils.auth_middleware import firebaseAuthRequired
from app.services.clover_service import CloverService
from app.services.paymentService import PaymentService

mobilePaymentBp = Blueprint('mobilePaymentBp', __name__)

@mobilePaymentBp.route('/api/client/<clientId>/payment/add', methods=['GET'])
# @firebaseAuthRequired
def getPaymentForm(clientId):
    templateData = {
        'clientId': clientId,
        'merchantName': 'Restaurant Name',
        'currency': 'USD'
    }
    
    return render_template(
        'payment_form.html',
        **templateData
    )

@mobilePaymentBp.route('/api/client/<clientId>/payment/process', methods=['POST'])
# @firebaseAuthRequired
def processPayment(clientId):
    try:
        paymentService = PaymentService()
        paymentData = request.json
        paymentToken = paymentData.get('paymentToken')
        products = paymentData.get('products')
        
        if not paymentToken:
            raise ValueError("Payment token is required")
            
        # Process payment data and get line items and total
        lineItems, totalAmount = paymentService.processPaymentData(products)
        
        # Create order payload
        orderPayload = paymentService.createOrderPayload(lineItems, totalAmount)
        
        # Get merchantId from your configuration or database
        merchantId = "6JDE8MZSA6FJ1"  # Replace with actual merchant ID retrieval
        
        # Create the order using CloverService
        cloverOrder = CloverService.createAtomicOrder(clientId, merchantId, orderPayload)
        
        # Pay the order using the payment token
        CloverService.payOrder(
            clientId=clientId,
            merchantId=merchantId, 
            orderId=cloverOrder.get('id'),
            paymentToken=paymentToken,
            amount=totalAmount
        )
        
        # Format response
        responseData = paymentService.formatResponseData(cloverOrder, totalAmount, clientId)
        
        return jsonify(responseData), 201

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
