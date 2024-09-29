from app.services.supabase_service import SupabaseService

def save_integration(client_id, integration_type_id, api_key):
    try:
        print(client_id, integration_type_id, api_key)
        SupabaseService.insertOrUpdateIntegration(client_id, integration_type_id)
        print("integration saved")
        SupabaseService.addOrUpdateCloverIntegration(client_id, api_key)    
        print("clover integration saved")
        return True, "Integration saved successfully"
    except Exception as e:
        return False, str(e)

