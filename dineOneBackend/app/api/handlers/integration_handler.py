from flask import jsonify, Blueprint, request
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebase_auth_required
from app.frontend.integrationsFrontend import save_integration

integrationBp = Blueprint('integrationBp', __name__)

@integrationBp.route('/clover/integration', methods=['POST'])
@firebase_auth_required
def saveIntegration():
    try:
        data = request.json
        print("data", data)
        clientId = int(data.get('clientId'))
        integrationTypeId = int(data.get('integrationType'))
        print("integrationTypeId", integrationTypeId)
        print("clientId", clientId)
        apiKey = data.get('apiKey')
        save_integration(clientId, integrationTypeId, apiKey)
        
        return jsonify({"message": "Integration saved successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@integrationBp.route('/integrations/<clientId>', methods=['GET'])
@firebase_auth_required
def getIntegration(clientId):
    try:
        integration = SupabaseService.getIntegrationByClientId(clientId)
        
        if integration:
            integrationData = {
                'clientId': integration.clientId,
                'integrationType': integration.integrationType
            }
            return jsonify({"integration": integrationData}), 200
        else:
            return jsonify({"message": "No integration found for this client"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@integrationBp.route('/clover/integration/<clientId>', methods=['GET'])
@firebase_auth_required
def getCloverIntegration(clientId):
    try:
        integration = SupabaseService.getCloverIntegrationByClientId(clientId)
        
        if integration:
            integrationData = {
                'clientId': integration.clientId,
                'apiKey': integration.apiKey
            }
            return jsonify({"integration": integrationData}), 200
        else:
            return jsonify({"message": "No Clover integration found for this client"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500