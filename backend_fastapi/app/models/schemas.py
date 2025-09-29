from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ExperimentStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PAUSED = "paused"

class DeviceType(str, Enum):
    MOBILE = "mobile"
    DESKTOP = "desktop"
    TABLET = "tablet"

class EventType(str, Enum):
    IMPRESSION = "impression"
    CLICK = "click"
    CONVERSION = "conversion"
    CUSTOM = "custom"

# Request Models
class AssignmentRequest(BaseModel):
    user_id: str = Field(..., description="Unique user identifier")
    experiment_id: str = Field(..., description="Experiment identifier")
    device_type: Optional[DeviceType] = Field(None, description="User's device type")
    geo_location: Optional[str] = Field(None, description="User's geographic location")

class EventRequest(BaseModel):
    user_id: str = Field(..., description="Unique user identifier")
    experiment_id: str = Field(..., description="Experiment identifier")
    variant: str = Field(..., description="Assigned variant")
    event_type: EventType = Field(..., description="Type of event")
    campaign_id: Optional[str] = Field(None, description="Campaign identifier")
    ad_id: Optional[str] = Field(None, description="Ad identifier")
    device_type: Optional[DeviceType] = Field(None, description="User's device type")
    geo_location: Optional[str] = Field(None, description="User's geographic location")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional event metadata")

class ExperimentConfig(BaseModel):
    experiment_id: str = Field(..., description="Unique experiment identifier")
    name: str = Field(..., description="Human-readable experiment name")
    description: Optional[str] = Field(None, description="Experiment description")
    status: ExperimentStatus = Field(..., description="Experiment status")
    variants: Dict[str, float] = Field(..., description="Variant allocation percentages")
    start_date: Optional[datetime] = Field(None, description="Experiment start date")
    end_date: Optional[datetime] = Field(None, description="Experiment end date")

# Response Models
class AssignmentResponse(BaseModel):
    user_id: str
    experiment_id: str
    variant: str
    assigned_at: datetime
    is_control: bool = Field(..., description="Whether this is the control group")

class EventResponse(BaseModel):
    event_id: str
    user_id: str
    experiment_id: str
    variant: str
    event_type: EventType
    recorded_at: datetime
    metadata: Optional[Dict[str, Any]] = None

class ExperimentStatsResponse(BaseModel):
    experiment_id: str
    total_users: int
    variant_distribution: Dict[str, int]
    events_by_type: Dict[str, int]
    conversion_rate: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)
