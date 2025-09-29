from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from datetime import datetime

from app.models.schemas import (
    AssignmentRequest, 
    AssignmentResponse, 
    ExperimentConfig,
    ExperimentStatsResponse
)
from app.utils.hash import get_variant_assignment, is_control_variant
from app.utils.database import get_database

router = APIRouter()

@router.post("/assignment", response_model=AssignmentResponse)
async def get_assignment(
    request: AssignmentRequest,
    db = Depends(get_database)
):
    """
    Assign a user to an experiment variant.
    
    Returns the assigned variant for the user. If the user was previously assigned,
    returns the same variant to ensure consistency.
    """
    try:
        # Check if user already has an assignment
        existing_assignment = await db.get_assignment(request.user_id, request.experiment_id)
        
        if existing_assignment:
            return AssignmentResponse(
                user_id=request.user_id,
                experiment_id=request.experiment_id,
                variant=existing_assignment["variant"],
                assigned_at=existing_assignment["assigned_at"],
                is_control=is_control_variant(existing_assignment["variant"])
            )
        
        # Get experiment configuration
        experiment = await db.get_experiment(request.experiment_id)
        if not experiment:
            raise HTTPException(status_code=404, detail="Experiment not found")
        
        if experiment["status"] != "active":
            raise HTTPException(status_code=400, detail="Experiment is not active")
        
        # Assign variant
        variant = get_variant_assignment(
            request.user_id, 
            request.experiment_id, 
            experiment["variants"]
        )
        
        # Save assignment
        assignment_data = {
            "user_id": request.user_id,
            "experiment_id": request.experiment_id,
            "variant": variant,
            "device_type": request.device_type,
            "geo_location": request.geo_location
        }
        await db.save_assignment(assignment_data)
        
        return AssignmentResponse(
            user_id=request.user_id,
            experiment_id=request.experiment_id,
            variant=variant,
            assigned_at=datetime.now(),
            is_control=is_control_variant(variant)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/experiments/{experiment_id}", response_model=ExperimentConfig)
async def get_experiment(
    experiment_id: str,
    db = Depends(get_database)
):
    """Get experiment configuration by ID."""
    experiment = await db.get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    return ExperimentConfig(**experiment)

@router.get("/experiments/{experiment_id}/stats", response_model=ExperimentStatsResponse)
async def get_experiment_stats(
    experiment_id: str,
    db = Depends(get_database)
):
    """Get experiment statistics including user distribution and conversion rates."""
    experiment = await db.get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    stats = await db.get_experiment_stats(experiment_id)
    return ExperimentStatsResponse(**stats)

@router.get("/experiments")
async def list_experiments(db = Depends(get_database)):
    """List all available experiments."""
    return {"experiments": list(db.experiments.keys())}
