from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class MuscleGroup(Base):
    __tablename__ = "muscle_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    workout_id = Column(Integer, ForeignKey("workouts.id"))

    # Relationships
    workout = relationship("Workout", back_populates="muscle_groups")
    exercises = relationship("Exercise", back_populates="muscle_group", cascade="all, delete-orphan") 