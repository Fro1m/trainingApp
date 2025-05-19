import os
import sys

# Get the absolute path of the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
# Add the backend directory to Python path
sys.path.insert(0, backend_dir)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from api.models.user import User
from api.models.workout import Workout
from api.models.exercise import Exercise, WeightHistory
from api.models.muscle_group import MuscleGroup
from datetime import datetime, UTC

# Create database engine - using SQLite for local development
SQLALCHEMY_DATABASE_URL = "sqlite:///./training_app.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Drop all tables and recreate them
Base.metadata.drop_all(bind=engine)
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

    # Create muscle groups
    muscle_groups = [
        MuscleGroup(
            name="Chest",
            description="Chest muscles including pectoralis major and minor",
            workout_id=workout.id
        ),
        MuscleGroup(
            name="Legs",
            description="Leg muscles including quadriceps, hamstrings, and calves",
            workout_id=workout.id
        ),
        MuscleGroup(
            name="Back",
            description="Back muscles including latissimus dorsi and trapezius",
            workout_id=workout.id
        )
    ]
    db.add_all(muscle_groups)
    db.commit()

    # Create sample exercises
    exercises = [
        Exercise(
            name="Bench Press",
            description="Chest exercise",
            muscle_group_id=muscle_groups[0].id,  # Chest
            sets=3,
            reps=10,
            current_weight=0,
            last_weight=0,
            record_weight=0
        ),
        Exercise(
            name="Squats",
            description="Leg exercise",
            muscle_group_id=muscle_groups[1].id,  # Legs
            sets=3,
            reps=10,
            current_weight=0,
            last_weight=0,
            record_weight=0
        ),
        Exercise(
            name="Deadlift",
            description="Back exercise",
            muscle_group_id=muscle_groups[2].id,  # Back
            sets=3,
            reps=10,
            current_weight=0,
            last_weight=0,
            record_weight=0
        )
    ]
    db.add_all(exercises)
    db.commit()

    # Add sample weight history
    for exercise in exercises:
        weight_history = WeightHistory(
            exercise_id=exercise.id,
            weight=50.0,  # Starting weight
            date=datetime.now(UTC)
        )
        db.add(weight_history)
    
    db.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized with sample data") 