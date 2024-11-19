from flask import jsonify, request, Blueprint
from app import db
from app.models.customer import Customer
from datetime import datetime
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired


customer_bp = Blueprint('customer_bp', __name__)

@customer_bp.route('/customer/', methods=['POST'])
@firebaseAuthRequired
def create_customer():
    try:
        client_id = request.clientId
        data = request.get_json()
        customer = Customer(
            authUUID=data['authUUID'],
            updatedAt=datetime.utcnow(),
            username=data.get('username'),
            firstName=data.get('firstName'),
            lastName=data.get('lastName'),
            clientId=data['clientId'],
            merchantId=data['merchantId'],
            email=data['email']
        )
        db.session.add(customer)
        db.session.commit()
        return jsonify(customer.toDict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@customer_bp.route('/api/v1/customers/<customer_id>', methods=['DELETE'])
@firebaseAuthRequired
def delete_customer(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@customer_bp.route('/customers/<merchant_id>', methods=['GET'])
@firebaseAuthRequired
def get_all_customers_by_merchant(merchant_id):
    try:
        clientId = request.clientId
        customers = Customer.query.filter_by(clientId=clientId).all()
        return jsonify({"customers": [customer.toDict() for customer in customers]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@customer_bp.route('/api/v1/customers/<customer_id>', methods=['GET'])
@firebaseAuthRequired
def get_customer_by_id(customer_id):
    try:
        clientId = request.clientId
        customer = Customer.query.filter_by(id=customer_id, clientId=clientId).first()
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        return jsonify(customer.toDict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
