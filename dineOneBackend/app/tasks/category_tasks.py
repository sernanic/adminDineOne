from celery import shared_task
from app.services.clover_service import CloverService
from app.services.cateogoryService import CategoryService

@shared_task(name="sync_categories")
def syncCategoriesTask(clientId, merchantId):
    try:
        categories = CloverService.fetchCategories(clientId, merchantId)
        for categoryData in categories:
            CategoryService.insertOrUpdateCategory(categoryData, merchantId, clientId)
            categoryId = categoryData.get('id')
            items = CloverService.fetchItemsByCategory(clientId, merchantId, categoryId)
            for item in items:
                CategoryService.insertOrUpdateCategoryItem(categoryId, item['id'], clientId)
        
        return {"status": "success", "message": "Categories and items synced successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)} 