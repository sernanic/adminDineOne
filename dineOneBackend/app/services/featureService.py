from app import db
from app.models.feature import Feature
from typing import List, Dict, Any

class FeatureService:
    @staticmethod
    def create_feature(data: Dict[str, Any]) -> Feature:
        feature = Feature(
            name=data['name'],
            imageURL=data['imageURL'],
            description=data['description'],
            clientId=data['clientId'],
            merchantId=data['merchantId'],
            itemId=data.get('itemId')
        )
        db.session.add(feature)
        db.session.commit()
        return feature

    @staticmethod
    def get_features(clientId: int, merchantId: str) -> List[Feature]:
        return Feature.query.filter_by(
            clientId=clientId,
            merchantId=merchantId
        ).all()

    @staticmethod
    def get_feature(feature_id: int) -> Feature:
        return Feature.query.get_or_404(feature_id)

    @staticmethod
    def update_feature(feature_id: int, data: Dict[str, Any]) -> Feature:
        feature = FeatureService.get_feature(feature_id)
        feature.name = data.get('name', feature.name)
        feature.imageURL = data.get('imageURL', feature.imageURL)
        feature.description = data.get('description', feature.description)
        feature.itemId = data.get('itemId', feature.itemId)
        
        db.session.commit()
        return feature

    @staticmethod
    def delete_feature(feature_id: int) -> None:
        feature = FeatureService.get_feature(feature_id)
        db.session.delete(feature)
        db.session.commit()
