from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.api.handlers.item_handler import item_bp
from app.api.handlers.category_handler import category_bp
from app.api.handlers.item_group_handler import itemGroupBp
from app.api.handlers.modifier_handler import modifierBp
from app.api.handlers.integration_handler import integrationBp
from app.api.handlers.client_handler import clientBp
from app.api.handlers.user_handler import userBp
from app.api.handlers.merchant_handler import merchantBp
from app.api.handlers.mobileAPI.mobile_category_handler import mobileCategoryBp
from app.api.handlers.mobileAPI.mobile_item_handler import mobileItemBp


api_bp = Blueprint('api_bp', __name__)

# Register the item routes
api_bp.register_blueprint(item_bp)
api_bp.register_blueprint(itemGroupBp)
api_bp.register_blueprint(category_bp)
api_bp.register_blueprint(modifierBp)
api_bp.register_blueprint(integrationBp)
api_bp.register_blueprint(clientBp)
api_bp.register_blueprint(userBp)
api_bp.register_blueprint(merchantBp)
api_bp.register_blueprint(mobileCategoryBp)
api_bp.register_blueprint(mobileItemBp)