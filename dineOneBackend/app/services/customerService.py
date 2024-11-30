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

    @staticmethod
    def getCustomerByAuthUUID(authUUID):
        """
        Get a customer by their authUUID.

        :param authUUID: The authentication UUID of the customer
        :return: Customer object or None if not found
        """
        try:
            customer = Customer.query.filter_by(authUUID=authUUID).first()
            return customer
        except Exception as e:
            print(f"An error occurred while fetching customer: {str(e)}")
            raise

    @staticmethod
    def toggleFavoriteItem(itemId, authUUID, clientId):
        """
        Toggle an item's favorite status for a customer.
        If the item is already favorited, it will be removed.
        If the item is not favorited, it will be added.

        :param itemId: The ID of the item to toggle
        :param authUUID: The authentication UUID of the customer
        :param clientId: The client ID
        :return: Tuple (Favorite object, str action) where action is 'added' or 'removed'
        """
        try:
            from app.models.favorite import Favorite
            from app.models.item import Item
            from app.models.customer import Customer
            
            # First verify the item exists
            item = Item.query.filter_by(itemId=itemId).first()
            if not item:
                print(f"Item not found: {itemId}")
                raise ValueError(f"Item not found: {itemId}")
            
            # Then verify the customer exists
            customer = Customer.query.filter_by(authUUID=authUUID).first()
            if not customer:
                print(f"Customer not found: {authUUID}")
                raise ValueError(f"Customer not found: {authUUID}")
            
            # Check if favorite already exists
            existingFavorite = Favorite.query.filter_by(
                itemId=itemId,
                customerAuthUUID=authUUID,
                clientId=clientId
            ).first()
            
            if existingFavorite:
                # Remove favorite if it exists
                db.session.delete(existingFavorite)
                db.session.commit()
                return None
            else:
                # Add new favorite if it doesn't exist
                favorite = Favorite(
                    itemId=itemId,
                    customerAuthUUID=authUUID,
                    clientId=clientId,
                )
                db.session.add(favorite)
                db.session.commit()
                return favorite
                
        except Exception as e:
            print(f"An error occurred while toggling favorite: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def getFavoriteItems(authUUID, clientId):
        """
        Get all favorite items for a customer.

        :param authUUID: The authentication UUID of the customer
        :param clientId: The client ID
        :return: List of Favorite objects
        """
        try:
            from app.models.favorite import Favorite
            
            favorites = Favorite.query.filter_by(
                customerAuthUUID=authUUID,
                clientId=clientId
            ).all()
            
            return favorites
        except Exception as e:
            print(f"An error occurred while fetching favorites: {str(e)}")
            raise

    @staticmethod
    def convertCustomerToDTO(customer, includeFavorites=True):
        """
        Convert a Customer model to CustomerDTO.

        :param customer: Customer object to convert
        :param includeFavorites: Boolean to determine if favorites should be included
        :return: CustomerDTO object
        """
        try:
            favorites = []
            if includeFavorites and customer:
                favorites = CustomerService.getFavoriteItems(
                    authUUID=customer.authUUID,
                    clientId=customer.clientId
                )
            
            from app.dto.customer_dto import CustomerDTO
            return CustomerDTO(customer=customer, favorites=favorites)
            
        except Exception as e:
            print(f"An error occurred while converting customer to DTO: {str(e)}")
            raise

    @staticmethod
    def updateCustomerMerchantId(authUUID, merchantId):
        """
        Update a customer's merchantId.

        :param authUUID: The authentication UUID of the customer
        :param merchantId: The new merchant ID to set
        :return: Updated Customer object or None if not found
        """
        try:
            print(f"Attempting to update customer with authUUID: {authUUID} to merchantId: {merchantId}")
            customer = CustomerService.getCustomerByAuthUUID(authUUID)
            print(f"Customer found: {customer}")
            if not customer:
                print("No customer found with the provided authUUID")
                return None
                
            customer.merchantId = merchantId
            customer.updatedAt = datetime.now()
            db.session.commit()
            print(f"Successfully updated customer {customer.id} with new merchantId: {merchantId}")
            
            return customer
        except Exception as e:
            print(f"An error occurred while updating customer merchant ID: {str(e)}")
            db.session.rollback()
            raise
