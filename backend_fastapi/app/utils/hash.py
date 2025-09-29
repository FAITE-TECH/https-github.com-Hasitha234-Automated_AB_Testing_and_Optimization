import hashlib
import hmac
import os
from typing import Dict

def get_variant_assignment(user_id: str, experiment_id: str, variants: Dict[str, float]) -> str:
    """
    Deterministically assign a user to a variant using HMAC hashing.
    
    Args:
        user_id: Unique user identifier
        experiment_id: Experiment identifier
        variants: Dictionary of variant names to allocation percentages (0-100)
    
    Returns:
        Assigned variant name
    """
    # Get salt and seed from environment
    salt = os.getenv("HMAC_SALT", "default-salt")
    seed = os.getenv("HASH_SEED", "default-seed")
    
    # Create hash input
    hash_input = f"{user_id}:{experiment_id}:{seed}"
    
    # Generate HMAC hash
    hash_value = hmac.new(
        salt.encode('utf-8'),
        hash_input.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Convert hash to integer (use first 8 hex chars for consistency)
    hash_int = int(hash_value[:8], 16)
    
    # Convert to percentage (0-100)
    percentage = (hash_int % 10000) / 100.0
    
    # Assign variant based on cumulative percentages
    cumulative = 0.0
    variant_names = list(variants.keys())
    
    for variant, allocation in variants.items():
        cumulative += allocation
        if percentage <= cumulative:
            return variant
    
    # Fallback to last variant if percentages don't add up to 100
    return variant_names[-1] if variant_names else "control"

def is_control_variant(variant: str) -> bool:
    """Check if a variant is the control group."""
    return variant.lower() in ["control", "original", "baseline"]

def generate_event_id() -> str:
    """Generate a unique event ID."""
    import uuid
    return str(uuid.uuid4())

def validate_experiment_config(variants: Dict[str, float]) -> bool:
    """
    Validate that variant allocations are valid.
    
    Args:
        variants: Dictionary of variant names to allocation percentages
    
    Returns:
        True if valid, False otherwise
    """
    if not variants:
        return False
    
    total_allocation = sum(variants.values())
    
    # Allow some tolerance for floating point precision
    return 99.9 <= total_allocation <= 100.1
