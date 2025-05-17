from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_app_is_fastapi():
    assert app.__class__.__name__ == 'FastAPI'

def test_app_has_routes():
    assert len(app.routes) > 0

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Training App API"} 