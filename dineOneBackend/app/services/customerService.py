from flask import current_app
from app.models.customer import Customer
from app import db
from datetime import datetime

class CustomerService:
    @staticmethod
    def createCustomer(customerData):
        """
        Create a new customer in the database.

        :param customerData: Dictionary containing customer information
        :return: Created Customer object or None if creation fails
        """
        try:
            customer = Customer(
                authUUID=customerData.get('authUUID'),
                updatedAt=datetime.now(),
                username=customerData.get('username'),
                firstName=customerData.get('firstName'),
                lastName=customerData.get('lastName'),
                clientId=customerData.get('clientId'),
                merchantId=customerData.get('merchantId'),
                email=customerData.get('email')
            )
            
            db.session.add(customer)
            db.session.commit()
            
            return customer
        except Exception as e:
            print(f"An error occurred while creating customer: {str(e)}")
            db.session.rollback()
            raise
