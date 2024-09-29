from enum import Enum

class IntegrationsEnum(Enum):
    CLOVER = 1
    CHOW_GPT = 2
    TOAST = 3
    SQUARE = 4

    def __int__(self):
        return self.value