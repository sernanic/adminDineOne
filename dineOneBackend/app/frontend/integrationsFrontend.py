from app.services.supabase_service import SupabaseService

def save_integration(client_id, integration_type_id, api_key):
    try:
        SupabaseService.insertOrUpdateIntegration(client_id, integration_type_id)
        # TODO: based on integration type, call the appropriate function
        SupabaseService.addOrUpdateCloverIntegration(client_id, api_key)    
        return True, "Integration saved successfully"
    except Exception as e:
        return False, str(e)

