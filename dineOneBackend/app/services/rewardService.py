from app.models.reward import Reward
from app import db
from typing import List, Dict, Any, Optional
import uuid

class RewardService:
    @staticmethod
    def create_reward(reward_data: Dict[str, Any]) -> Reward:
        """Create a new reward"""
        reward = Reward(
            rewardId=str(uuid.uuid4()),  # Generate a unique rewardId
            rewardName=reward_data['rewardName'],
            pointsRequired=reward_data['pointsRequired'],
            clientId=reward_data['clientId'],
            merchantId=reward_data['merchantId'],
            associatedItemId=reward_data.get('associatedItemId'),
            imageURL=reward_data.get('imageURL'),
            description=reward_data.get('description')
        )
        db.session.add(reward)
        db.session.commit()
        return reward

    @staticmethod
    def get_rewards(client_id: int, merchant_id: str) -> List[Reward]:
        """Get all rewards for a merchant"""
        return Reward.query.filter_by(
            clientId=client_id,
            merchantId=merchant_id,
            deleted=False
        ).all()

    @staticmethod
    def get_reward(id: int) -> Optional[Reward]:
        """Get a specific reward by ID"""
        return Reward.query.filter_by(id=id, deleted=False).first()

    @staticmethod
    def update_reward(id: int, update_data: Dict[str, Any]) -> Optional[Reward]:
        """Update an existing reward"""
        reward = RewardService.get_reward(id)
        if not reward:
            return None

        # Update allowed fields
        if 'rewardName' in update_data:
            reward.rewardName = update_data['rewardName']
        if 'pointsRequired' in update_data:
            reward.pointsRequired = update_data['pointsRequired']
        if 'associatedItemId' in update_data:
            reward.associatedItemId = update_data['associatedItemId']
        if 'imageURL' in update_data:
            reward.imageURL = update_data['imageURL']
        if 'description' in update_data:
            reward.description = update_data['description']

        db.session.commit()
        return reward

    @staticmethod
    def delete_reward(id: int) -> bool:
        """Soft delete a reward"""
        reward = RewardService.get_reward(id)
        if not reward:
            return False

        reward.deleted = True
        db.session.commit()
        return True
