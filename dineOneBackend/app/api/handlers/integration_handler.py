from flask import jsonify, Blueprint, request
from app.services.supabase_service import SupabaseService
from app.utils.auth_middleware import firebaseAuthRequired
from app.frontend.integrationsFrontend import save_integration

integrationBp = Blueprint('integrationBp', __name__)

@integrationBp.route('/clover/integration', methods=['POST'])
@firebaseAuthRequired
def saveIntegration():
    try:
        clientId = request.clientId
        data = request.json
        clientId = clientId
        integrationTypeId = int(data.get('integrationType'))
        apiKey = data.get('apiKey')
        save_integration(clientId, integrationTypeId, apiKey)
        
        return jsonify({"message": "Integration saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@integrationBp.route('/integrations/<clientId>', methods=['GET'])
@firebaseAuthRequired
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

@integrationBp.route('/clover/integration/', methods=['GET'])
@firebaseAuthRequired
def getCloverIntegration():
    try:
        clientId = request.clientId
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