from celery import shared_task
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService

@shared_task(name='syncModifiersTask')
def syncModifiersTask(merchantId, clientId):
    try:
        modifiers = CloverService.fetchModifiers(clientId, merchantId)
        for modifierData in modifiers:
            SupabaseService.insertOrUpdateModifier(modifierData, merchantId, clientId)
        return "Modifiers synced successfully"
    except Exception as e:
        return f"Error syncing modifiers: {str(e)}"