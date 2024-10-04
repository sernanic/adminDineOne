import requests
from flask import current_app, Flask

class CloverService:

    @staticmethod
    def fetchItems(merchant_id):
        with current_app.app_context():
            url = f"https://api.clover.com/v3/merchants/{merchant_id}/items"
            headers = {
                "Authorization": f"Bearer {current_app.config['CLOVER_API_KEY']}"
            }
            response = requests.get(url, headers=headers)
            print("clover response", response.json()['elements'])
            if response.status_code == 200:
                return response.json()['elements']  # Assuming the items are in the 'elements' key
            else:
                response.raise_for_status()

    @staticmethod
    def fetchCategories(merchant_id):
        with current_app.app_context():
            url = f"https://api.clover.com/v3/merchants/{merchant_id}/categories"
            headers = {
                "Authorization": f"Bearer {current_app.config['CLOVER_API_KEY']}"
            }
            response = requests.get(url, headers=headers)
            print("clover response", response.json()['elements'])
            if response.status_code == 200:
                return response.json()['elements']  # Assuming the categories are in the 'elements' key
            else:
                response.raise_for_status()

    @staticmethod
    def fetchItemGroups(merchant_id):
        with current_app.app_context():
            url = f"https://api.clover.com/v3/merchants/{merchant_id}/item_groups"
            headers = {
                "Authorization": f"Bearer {current_app.config['CLOVER_API_KEY']}"
            }
            response = requests.get(url, headers=headers)
            print("clover response", response.json()['elements'])
            if response.status_code == 200:
                return response.json()['elements']  # Assuming the item groups are in the 'elements' key
            else:
                response.raise_for_status()

    @staticmethod
    def fetchModifierGroups(merchant_id):
        with current_app.app_context():
            url = f"https://api.clover.com/v3/merchants/{merchant_id}/modifier_groups"
            headers = {
                "Authorization": f"Bearer {current_app.config['CLOVER_API_KEY']}"
            }
            response = requests.get(url, headers=headers)
            print("clover response", response.json()['elements'])
            if response.status_code == 200:
                return response.json()['elements']  # Assuming the modifier groups are in the 'elements' key
            else:
                response.raise_for_status()

    @staticmethod
    def fetchModifiers(merchant_id):
        with current_app.app_context():
            url = f"https://api.clover.com/v3/merchants/{merchant_id}/modifiers"
            headers = {
                "Authorization": f"Bearer {current_app.config['CLOVER_API_KEY']}"
            }
            response = requests.get(url, headers=headers)
            print("clover response", response.json()['elements'])
            if response.status_code == 200:
                return response.json()['elements']  # Assuming the modifiers are in the 'elements' key
            else:
                response.raise_for_status()

    @staticmethod
    def fetchItemsByCategory(merchant_id, category_id):
        with current_app.app_context():
            url = f"https://api.clover.com/v3/merchants/{merchant_id}/categories/{category_id}/items"
            headers = {
                "Authorization": f"Bearer {current_app.config['CLOVER_API_KEY']}"
            }
            response = requests.get(url, headers=headers)
            print("clover response", response.json()['elements'])
            if response.status_code == 200:
                print("clover response", response.json())
                return response.json()['elements']  # Assuming the items are in the 'elements' key
            else:
                response.raise_for_status()

    @staticmethod
    def fetchItemModifierGroups(merchant_id, item_id):
        with current_app.app_context():
            print("merchant_id", merchant_id)
            url = f"https://api.clover.com/v3/merchants/{merchant_id}/items/{item_id}?expand=modifierGroups"
            headers = {
                "Authorization": f"Bearer {current_app.config['CLOVER_API_KEY']}"
            }
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return response.json() # Assuming the modifier groups are in the 'elements' key
            else:
                response.raise_for_status()

