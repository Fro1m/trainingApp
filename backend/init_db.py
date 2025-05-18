from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.database import Base
from api.models.user import User
from api.models.workout import Workout
from api.models.exercise import Exercise, WeightHistory
from datetime import datetime

# Create database engine
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@postgres:5432/training_app"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create all tables
Base.metadata.create_all(bind=engine)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Create initial data
def init_db():
    # Create admin user if not exists
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            email="admin@example.com",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            is_active=True,
            is_superuser=True
        )
        db.add(admin)
        db.commit()

    # Create sample workout
    workout = Workout(
        name="Full Body Workout",
        description="A complete full body workout routine",
        user_id=admin.id,
        scheduled_date=None,
        is_completed=False
    )
    db.add(workout)
    db.commit()

    # Create sample exercises
    exercises = [
        Exercise(
            name="Bench Press",
            description="Chest exercise",
            workout_id=workout.id
        ),
        Exercise(
            name="Squats",
            description="Leg exercise",
            workout_id=workout.id
        ),
        Exercise(
            name="Deadlift",
            description="Back exercise",
            workout_id=workout.id
        )
    ]
    db.add_all(exercises)
    db.commit()

    # Add sample weight history
    for exercise in exercises:
        weight_history = WeightHistory(
            exercise_id=exercise.id,
            weight=50.0,  # Starting weight
            date=datetime.utcnow()
        )
        db.add(weight_history)
    
    db.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized with sample data") 