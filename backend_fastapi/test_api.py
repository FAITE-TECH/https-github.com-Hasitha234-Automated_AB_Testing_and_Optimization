#!/usr/bin/env python3
"""
Simple test script for the FastAPI A/B Testing backend
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🏥 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_assignment():
    """Test assignment endpoint"""
    print("🎯 Testing assignment endpoint...")
    payload = {
        "user_id": "test_user_123",
        "experiment_id": "homepage_banner",
        "device_type": "desktop",
        "geo_location": "US"
    }
    
    response = requests.post(f"{BASE_URL}/api/assignment", json=payload)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Assignment: {data}")
        return data
    else:
        print(f"Error: {response.text}")
        return None

def test_event_tracking(assignment_data):
    """Test event tracking"""
    if not assignment_data:
        print("⚠️  Skipping event tracking - no assignment data")
        return
    
    print("📊 Testing event tracking...")
    
    # Track impression
    impression_payload = {
        "user_id": assignment_data["user_id"],
        "experiment_id": assignment_data["experiment_id"],
        "variant": assignment_data["variant"],
        "event_type": "impression",
        "campaign_id": "test_campaign_001",
        "ad_id": "banner_ad_001",
        "device_type": "desktop"
    }
    
    response = requests.post(f"{BASE_URL}/api/events", json=impression_payload)
    print(f"Impression Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Impression Event: {response.json()}")
    
    # Track conversion
    conversion_payload = {
        "user_id": assignment_data["user_id"],
        "experiment_id": assignment_data["experiment_id"],
        "variant": assignment_data["variant"],
        "event_type": "conversion",
        "metadata": {"purchase_amount": 99.99, "product_id": "prod_123"}
    }
    
    response = requests.post(f"{BASE_URL}/api/events", json=conversion_payload)
    print(f"Conversion Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Conversion Event: {response.json()}")
    print()

def test_experiment_stats():
    """Test experiment stats"""
    print("📈 Testing experiment stats...")
    response = requests.get(f"{BASE_URL}/api/experiments/homepage_banner/stats")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        stats = response.json()
        print(f"Experiment Stats: {json.dumps(stats, indent=2)}")
    else:
        print(f"Error: {response.text}")
    print()

def test_swagger_docs():
    """Test Swagger documentation"""
    print("📚 Testing Swagger documentation...")
    response = requests.get(f"{BASE_URL}/docs")
    print(f"Swagger UI Status: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/openapi.json")
    print(f"OpenAPI Schema Status: {response.status_code}")
    print()

def main():
    print("🚀 FastAPI A/B Testing Backend Test Suite")
    print("=" * 50)
    
    try:
        # Test health
        test_health()
        
        # Test assignment
        assignment_data = test_assignment()
        
        # Test event tracking
        test_event_tracking(assignment_data)
        
        # Test stats
        test_experiment_stats()
        
        # Test docs
        test_swagger_docs()
        
        print("✅ All tests completed!")
        print(f"🌐 Visit {BASE_URL}/docs for interactive API documentation")
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Make sure the FastAPI server is running on port 8000")
        print("Start server with: python main.py")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    main()
