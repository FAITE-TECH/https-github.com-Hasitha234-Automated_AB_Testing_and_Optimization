import os
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime

# Mock database for demo purposes
# In production, replace with actual PostgreSQL connection
class MockDatabase:
    def __init__(self):
        self.events: List[Dict[str, Any]] = []
        self.assignments: Dict[str, Dict[str, Any]] = {}
        self.experiments: Dict[str, Dict[str, Any]] = {
            # Default experiment for demo
            "homepage_banner": {
                "experiment_id": "homepage_banner",
                "name": "Homepage Banner Test",
                "description": "Testing different banner designs",
                "status": "active",
                "variants": {"control": 50.0, "variant_a": 30.0, "variant_b": 20.0},
                "start_date": datetime.now(),
                "end_date": None
            }
        }
    
    async def insert_event(self, event_data: Dict[str, Any]) -> str:
        """Insert an event record."""
        from app.utils.hash import generate_event_id
        
        event_id = generate_event_id()
        event_record = {
            "id": event_id,
            "recorded_at": datetime.now(),
            **event_data
        }
        self.events.append(event_record)
        return event_id
    
    async def get_assignment(self, user_id: str, experiment_id: str) -> Optional[Dict[str, Any]]:
        """Get existing assignment for user and experiment."""
        key = f"{user_id}:{experiment_id}"
        return self.assignments.get(key)
    
    async def save_assignment(self, assignment_data: Dict[str, Any]) -> None:
        """Save a new assignment."""
        key = f"{assignment_data['user_id']}:{assignment_data['experiment_id']}"
        self.assignments[key] = {
            "assigned_at": datetime.now(),
            **assignment_data
        }
    
    async def get_experiment(self, experiment_id: str) -> Optional[Dict[str, Any]]:
        """Get experiment configuration."""
        return self.experiments.get(experiment_id)
    
    async def get_experiment_stats(self, experiment_id: str) -> Dict[str, Any]:
        """Get experiment statistics."""
        # Count assignments
        assignments = [a for a in self.assignments.values() if a["experiment_id"] == experiment_id]
        total_users = len(assignments)
        
        # Count by variant
        variant_distribution = {}
        for assignment in assignments:
            variant = assignment["variant"]
            variant_distribution[variant] = variant_distribution.get(variant, 0) + 1
        
        # Count events by type
        experiment_events = [e for e in self.events if e["experiment_id"] == experiment_id]
        events_by_type = {}
        for event in experiment_events:
            event_type = event["event_type"]
            events_by_type[event_type] = events_by_type.get(event_type, 0) + 1
        
        # Calculate conversion rate
        conversions = events_by_type.get("conversion", 0)
        conversion_rate = (conversions / total_users * 100) if total_users > 0 else 0
        
        return {
            "experiment_id": experiment_id,
            "total_users": total_users,
            "variant_distribution": variant_distribution,
            "events_by_type": events_by_type,
            "conversion_rate": conversion_rate
        }

# Global database instance
db = MockDatabase()

async def get_database():
    """Dependency to get database instance."""
    return db
