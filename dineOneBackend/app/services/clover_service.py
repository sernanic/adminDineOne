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
