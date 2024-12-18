from app.models.modifier import Modifier
from app.models.modifierImages import ModifierImage
from app.models.itemModifierGroups import ItemModifierGroup
from app import db

class ModifierService:
    @staticmethod
    def deleteModifiers(modifierIds: list, merchantId: str = None, clientId: int = None) -> None:
        """
        Delete modifiers and their associated records (images and item modifier groups).
        
        :param modifierIds: List of modifier IDs to delete
        :param merchantId: Optional merchant ID filter
        :param clientId: Optional client ID filter
        """
        try:
            # First delete associated modifier images
            ModifierImage.query.filter(
                ModifierImage.modifierId.in_(modifierIds)
            ).delete(synchronize_session=False)
            
            # Delete associated item modifier groups
            ItemModifierGroup.query.filter(
                ItemModifierGroup.modifierId.in_(modifierIds)
            ).delete(synchronize_session=False)
            
            # Build the base query for modifiers
            query = Modifier.query.filter(Modifier.modifierId.in_(modifierIds))
            
            # Add optional filters if provided
            if merchantId is not None:
                query = query.filter(Modifier.merchantId == merchantId)
            if clientId is not None:
                query = query.filter(Modifier.clientId == clientId)
            
            # Delete the modifiers
            query.delete(synchronize_session=False)
            
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise

    @staticmethod
    def deleteNonExistentModifiers(merchantId: str, clientId: int, modifierIds: list) -> None:
        """
        Delete modifiers that exist in our database but not in Clover anymore.
        First deletes associated records to handle foreign key constraints.
        
        :param merchantId: The merchant ID
        :param clientId: The client ID
        :param modifierIds: List of modifier IDs that exist in Clover
        """
        # Get all existing modifiers for this merchant
        existing_modifiers = Modifier.query.filter_by(merchantId=merchantId, clientId=clientId).all()
        existing_modifier_ids = {modifier.modifierId for modifier in existing_modifiers}
        
        # Find modifiers to delete (exist in our DB but not in incoming data)
        modifiers_to_delete = existing_modifier_ids - set(modifierIds)
        
        # Delete modifiers that no longer exist in Clover
        if modifiers_to_delete:
            ModifierService.deleteModifiers(list(modifiers_to_delete), merchantId, clientId)
