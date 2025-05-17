from database import engine, Base
from models.workout import Workout, MuscleGroup, Exercise, ExerciseProgress

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Creating database tables...")
    init_db()
    print("Database tables created successfully!") 