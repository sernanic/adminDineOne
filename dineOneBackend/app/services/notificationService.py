from app import db
from app.models.notification import Notification
from typing import List, Dict, Any

class NotificationService:
    @staticmethod
    def create_notification(data: Dict[str, Any]) -> Notification:
        notification = Notification(
            header=data['header'],
            body=data['body'],
            clientId=data['clientId'],
            merchantId=data['merchantId'],
            imageUrl=data.get('imageUrl')
        )
        db.session.add(notification)
        db.session.commit()
        return notification

    @staticmethod
    def get_notifications(clientId: int, merchantId: str) -> List[Notification]:
        return Notification.query.filter_by(
            clientId=clientId,
            merchantId=merchantId
        ).all()

    @staticmethod
    def get_notification(notification_id: int) -> Notification:
        return Notification.query.get_or_404(notification_id)

    @staticmethod
    def update_notification(notification_id: int, data: Dict[str, Any]) -> Notification:
        notification = NotificationService.get_notification(notification_id)
        for key, value in data.items():
            if hasattr(notification, key):
                setattr(notification, key, value)
        db.session.commit()
        return notification

    @staticmethod
    def delete_notification(notification_id: int) -> bool:
        notification = NotificationService.get_notification(notification_id)
        db.session.delete(notification)
        db.session.commit()
        return True
