from celery import shared_task
from app.services.clover_service import CloverService
from app.services.supabase_service import SupabaseService
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@shared_task(
    name="syncItemsTask",
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 3, 'countdown': 5}
)
def syncItemsTask(self, clientId, merchantId):
    try:
        logger.info(f"Starting item sync for merchant {merchantId}")
        items = CloverService.fetchItems(clientId, merchantId)
        for itemData in items:
            SupabaseService.insertOrUpdateItem(itemData, merchantId, clientId)
        logger.info(f"Item sync completed for merchant {merchantId}")
        return {"status": "success", "message": "Items synced successfully"}
    except Exception as e:
        logger.error(f"Error syncing items: {str(e)}")
        raise