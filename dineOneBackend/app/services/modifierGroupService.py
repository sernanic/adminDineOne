from app.models.modifier_group import ModifierGroup
from app.models.modifier import Modifier
from app.models.modifierImages import ModifierImage
from app.models.itemModifierGroups import ItemModifierGroup
from app import db

class ModifierGroupService:
    @staticmethod
    def deleteModifierGroups(modifierGroupIds: list, merchantId: str = None, clientId: int = None) -> None:
        """
        Delete modifier groups and their associated records.
        This includes all modifiers belonging to these groups and their related records.
        
        :param modifierGroupIds: List of modifier group IDs to delete
        :param merchantId: Optional merchant ID filter
        :param clientId: Optional client ID filter
        """
        try:
            # First get all modifiers associated with these groups
            modifiers = Modifier.query.filter(
                Modifier.modifierGroupId.in_(modifierGroupIds)
            ).all()
            modifier_ids = [modifier.modifierId for modifier in modifiers]

            # Delete modifier images for all associated modifiers
            if modifier_ids:
                ModifierImage.query.filter(
                    ModifierImage.modifierId.in_(modifier_ids)
                ).delete(synchronize_session=False)
            
            # Delete associated item modifier groups
            ItemModifierGroup.query.filter(
                ItemModifierGroup.modifierGroupId.in_(modifierGroupIds)
            ).delete(synchronize_session=False)
            
            # Delete all modifiers associated with these groups
            if modifier_ids:
                Modifier.query.filter(
                    Modifier.modifierId.in_(modifier_ids)
                ).delete(synchronize_session=False)
            
            # Build the base query for modifier groups
            query = ModifierGroup.query.filter(ModifierGroup.modifierGroupId.in_(modifierGroupIds))
            
            # Add optional filters if provided
            if merchantId is not None:
                query = query.filter(ModifierGroup.merchantId == merchantId)
            if clientId is not None:
                query = query.filter(ModifierGroup.clientId == clientId)
            
            # Delete the modifier groups
            query.delete(synchronize_session=False)
            
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise

    @staticmethod
    def deleteNonExistentModifierGroups(merchantId: str, clientId: int, modifierGroupIds: list) -> None:
        """
        Delete modifier groups that exist in our database but not in Clover anymore.
        This will also delete all associated modifiers and their related records.
        
        :param merchantId: The merchant ID
        :param clientId: The client ID
        :param modifierGroupIds: List of modifier group IDs that exist in Clover
        """
        # Get all existing modifier groups for this merchant
        existing_groups = ModifierGroup.query.filter_by(merchantId=merchantId, clientId=clientId).all()
        existing_group_ids = {group.modifierGroupId for group in existing_groups}
        
        # Find modifier groups to delete (exist in our DB but not in incoming data)
        groups_to_delete = existing_group_ids - set(modifierGroupIds)
        
        # Delete modifier groups that no longer exist in Clover
        if groups_to_delete:
            ModifierGroupService.deleteModifierGroups(list(groups_to_delete), merchantId, clientId)
