from app import app

def test_app_is_fastapi():
    assert app.__class__.__name__ == 'FastAPI'

def test_app_has_routes():
    assert len(app.routes) > 0 