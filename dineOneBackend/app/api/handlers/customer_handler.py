from flask import jsonify, request, Blueprint
from app import db
from app.models.customer import Customer
from datetime import datetime

customer_bp = Blueprint('customer_bp', __name__)

@customer_bp.route('/api/v1/client/<client_id>/customers', methods=['POST'])
def create_customer(client_id):
    try:
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

@customer_bp.route('/api/v1/client/<client_id>/customers', methods=['GET'])
def get_all_customers_by_client(client_id):
    try:
        customers = Customer.query.filter_by(clientId=client_id).all()
        return jsonify([customer.toDict() for customer in customers]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@customer_bp.route('/api/v1/customers/<customer_id>', methods=['GET'])
def get_customer_by_id(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        return jsonify(customer.toDict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
