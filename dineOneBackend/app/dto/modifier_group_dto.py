from typing import List
from .modifier_dto import ModifierDTO

class ModifierGroupDTO:
    def __init__(self, modifierGroup, modifiers: List[ModifierDTO] = None):
        self.modifierGroup = modifierGroup
        self.modifiers = modifiers or []

    @classmethod
    def fromModel(cls, modifierGroupModel):
        modifiers = [ModifierDTO.fromModel(modifier) for modifier in modifierGroupModel.modifiers]
        return cls(modifierGroupModel, modifiers)

    def __repr__(self):
        return f"<ModifierGroupDTO modifierGroup={self.modifierGroup}, modifiers_count={len(self.modifiers)}>"

    def toDict(self):
        return {
            'modifierGroupId': self.modifierGroup.modifierGroupId,
            'merchantId': self.modifierGroup.merchantId,
            'name': self.modifierGroup.name,
            'showByDefault': self.modifierGroup.showByDefault,
            'sortOrder': self.modifierGroup.sortOrder,
            'deleted': self.modifierGroup.deleted,
            'modifiers': [modifier.toDict() for modifier in self.modifiers]
        }
