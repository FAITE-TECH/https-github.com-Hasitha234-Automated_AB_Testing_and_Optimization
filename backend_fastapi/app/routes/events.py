from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime

from app.models.schemas import EventRequest, EventResponse
from app.utils.database import get_database

router = APIRouter()

@router.post("/events", response_model=EventResponse)
async def track_event(
    request: EventRequest,
    db = Depends(get_database)
):
    """
    Track an event for A/B testing analytics.
    
    Records user interactions, conversions, and other events for experiment analysis.
    """
    try:
        # Validate that experiment exists
        experiment = await db.get_experiment(request.experiment_id)
        if not experiment:
            raise HTTPException(status_code=404, detail="Experiment not found")
        
        # Prepare event data
        event_data = {
            "user_id": request.user_id,
            "experiment_id": request.experiment_id,
            "variant": request.variant,
            "event_type": request.event_type.value,
            "campaign_id": request.campaign_id,
            "ad_id": request.ad_id,
            "device_type": request.device_type.value if request.device_type else None,
            "geo_location": request.geo_location,
            "metadata": request.metadata or {}
        }
        
        # Insert event
        event_id = await db.insert_event(event_data)
        
        return EventResponse(
            event_id=event_id,
            user_id=request.user_id,
            experiment_id=request.experiment_id,
            variant=request.variant,
            event_type=request.event_type,
            recorded_at=datetime.now(),
            metadata=request.metadata
        )
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/events/{experiment_id}")
async def get_experiment_events(
    experiment_id: str,
    limit: int = 100,
    db = Depends(get_database)
):
    """Get events for a specific experiment."""
    experiment = await db.get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    # Filter events for this experiment
    experiment_events = [
        event for event in db.events 
        if event["experiment_id"] == experiment_id
    ]
    
    # Sort by recorded_at and limit
    experiment_events.sort(key=lambda x: x["recorded_at"], reverse=True)
    experiment_events = experiment_events[:limit]
    
    return {
        "experiment_id": experiment_id,
        "events": experiment_events,
        "total_count": len(experiment_events)
    }

@router.post("/events/impression")
async def track_impression(
    user_id: str,
    experiment_id: str,
    variant: str,
    campaign_id: str = None,
    ad_id: str = None,
    db = Depends(get_database)
):
    """Convenience endpoint for tracking ad impressions."""
    request = EventRequest(
        user_id=user_id,
        experiment_id=experiment_id,
        variant=variant,
        event_type="impression",
        campaign_id=campaign_id,
        ad_id=ad_id
    )
    return await track_event(request, db)

@router.post("/events/click")
async def track_click(
    user_id: str,
    experiment_id: str,
    variant: str,
    campaign_id: str = None,
    ad_id: str = None,
    db = Depends(get_database)
):
    """Convenience endpoint for tracking ad clicks."""
    request = EventRequest(
        user_id=user_id,
        experiment_id=experiment_id,
        variant=variant,
        event_type="click",
        campaign_id=campaign_id,
        ad_id=ad_id
    )
    return await track_event(request, db)

@router.post("/events/conversion")
async def track_conversion(
    user_id: str,
    experiment_id: str,
    variant: str,
    campaign_id: str = None,
    ad_id: str = None,
    metadata: dict = None,
    db = Depends(get_database)
):
    """Convenience endpoint for tracking conversions."""
    request = EventRequest(
        user_id=user_id,
        experiment_id=experiment_id,
        variant=variant,
        event_type="conversion",
        campaign_id=campaign_id,
        ad_id=ad_id,
        metadata=metadata
    )
    return await track_event(request, db)
