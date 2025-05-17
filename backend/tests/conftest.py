import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import app
from database import Base
import os

# Test database URL - using SQLite for tests
TEST_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture(scope="session")
def test_db():
    # Create test database engine
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a test database session
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Clean up - remove test database
        if os.path.exists("./test.db"):
            os.remove("./test.db")

@pytest.fixture(scope="module")
def test_app():
    # Override the database URL for testing
    app.dependency_overrides = {}
    return app 