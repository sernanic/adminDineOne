import requests
from flask import current_app
from app.services.supabase_service import SupabaseService

class CloverService:

    @staticmethod
    def fetchItems(clientId, merchantId):
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/items"
        headers = {
            "Authorization": f"Bearer {apiKey}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()['elements']
        else:
            response.raiseForStatus()

    @staticmethod
    def fetchCategories(clientId, merchantId):
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/categories"
        headers = {
            "Authorization": f"Bearer {apiKey}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()['elements']
        else:
            response.raiseForStatus()

    @staticmethod
    def fetchItemGroups(clientId, merchantId):
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/item_groups"
        headers = {
            "Authorization": f"Bearer {apiKey}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()['elements']
        else:
            response.raiseForStatus()

    @staticmethod
    def fetchModifierGroups(clientId, merchantId):
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/modifier_groups"
        headers = {
            "Authorization": f"Bearer {apiKey}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()['elements']
        else:
            response.raiseForStatus()

    @staticmethod
    def fetchModifiers(clientId, merchantId):
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/modifiers"
        headers = {
            "Authorization": f"Bearer {apiKey}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()['elements']
        else:
            response.raiseForStatus()

    @staticmethod
    def fetchItemsByCategory(clientId, merchantId, categoryId):
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/categories/{categoryId}/items"
        headers = {
            "Authorization": f"Bearer {apiKey}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()['elements']
        else:
            response.raiseForStatus()

    @staticmethod
    def fetchItemModifierGroups(clientId, merchantId, itemId):
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/items/{itemId}?expand=modifierGroups"
        headers = {
            "Authorization": f"Bearer {apiKey}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            response.raiseForStatus()

    @staticmethod
    def getCloverApiKey(clientId):
        integration = SupabaseService.getCloverIntegrationByClientId(clientId)
        if integration and integration.apiKey:
            return integration.apiKey
        else:
            raise ValueError(f"No valid Clover integration found for client ID: {clientId}")

    @staticmethod
    def createAtomicOrder(clientId, merchantId, orderData):
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/atomic_order/orders"
        headers = {
            "Authorization": f"Bearer {apiKey}",
            "Content-Type": "application/json"
        }
        
        # Check if orderCart exists
        if 'orderCart' not in orderData:
            raise ValueError("Missing required 'orderCart' in order data")

        # Required fields should be checked within orderCart
        requiredFields = ["lineItems", "state", "manualTransaction", "groupLineItems", "testMode"]
        if not all(field in orderData['orderCart'] for field in requiredFields):
            raise ValueError("Missing required fields in orderCart")
        
        # Validate line items structure
        lineItems = orderData['orderCart'].get("lineItems")
        if not lineItems or not isinstance(lineItems, list):
            raise ValueError("lineItems must be a non-empty list")
            
        
        response = requests.post(url, headers=headers, json=orderData)
        
        if response.status_code in [200, 201]:
            return response.json()
        else:
            # Log the error response for debugging
            print(f"Clover API Error: {response.status_code}")
            print(f"Response: {response.text}")
            response.raise_for_status()

    @staticmethod
    def payOrder(clientId, merchantId, orderId, paymentToken, amount):
        """
        Pay for an order using Clover's payment endpoint
        """
        # Get tenders and find credit card tender ID
        tenders = CloverService.fetchTenders(clientId, merchantId)
        creditCardTender = next(
            (tender for tender in tenders if tender['labelKey'] == 'com.clover.tender.external_payment'),
            None
        )
        
        if not creditCardTender:
            raise ValueError("Credit card tender not found for this merchant")
            
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/orders/{orderId}/payments"
        
        payload = {
            "order": {"id": orderId},
            "tender": {"id": creditCardTender['id']}, 
            "offline": "false",
            "transactionSettings": {
                "disableCashBack": "false",
                "cloverShouldHandleReceipts": "true",
                "forcePinEntryOnSwipe": "false",
                "disableRestartTransactionOnFailure": "false",
                "allowOfflinePayment": "false",
                "approveOfflinePaymentWithoutPrompt": "false",
                "forceOfflinePayment": "false",
                "disableReceiptSelection": "false",
                "disableDuplicateCheck": "false",
                "autoAcceptPaymentConfirmations": "false",
                "autoAcceptSignature": "false",
                "returnResultOnTransactionComplete": "false",
                "disableCreditSurcharge": "false"
            },
            "transactionInfo": {
                "isTokenBasedTx": "false",
                "emergencyFlag": "false"
            },
            "amount": amount,
            "source": paymentToken
        }
        
        headers = {
            "content-type": "application/json",
            "Authorization": f"Bearer {apiKey}"
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code in [200, 201]:
            return response.json()
        else:
            print(f"Clover API Error: {response.status_code}")
            print(f"Response: {response.text}")
            response.raise_for_status()

    @staticmethod
    def fetchTenders(clientId, merchantId):
        """
        Fetch all tenders for a merchant from Clover API
        
        Args:
            clientId: Client's ID
            merchantId: Merchant's ID
            
        Returns:
            List of tender objects
        """
        apiKey = CloverService.getCloverApiKey(clientId)
        url = f"https://api.clover.com/v3/merchants/{merchantId}/tenders"
        headers = {
            "Authorization": f"Bearer {apiKey}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()['elements']
        else:
            response.raise_for_status()
