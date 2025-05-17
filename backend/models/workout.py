from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    muscle_groups = relationship("MuscleGroup", back_populates="workout", cascade="all, delete-orphan")

class MuscleGroup(Base):
    __tablename__ = "muscle_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    workout_id = Column(Integer, ForeignKey("workouts.id"))
    
    # Relationships
    workout = relationship("Workout", back_populates="muscle_groups")
    exercises = relationship("Exercise", back_populates="muscle_group", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sets = Column(Integer, nullable=False)
    reps = Column(Integer, nullable=False)
    current_weight = Column(Integer, default=0)
    last_weight = Column(Integer, default=0)
    record_weight = Column(Integer, default=0)
    muscle_group_id = Column(Integer, ForeignKey("muscle_groups.id"))
    
    # Relationships
    muscle_group = relationship("MuscleGroup", back_populates="exercises")
    progress_history = relationship("ExerciseProgress", back_populates="exercise", cascade="all, delete-orphan")

class ExerciseProgress(Base):
    __tablename__ = "exercise_progress"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    weight = Column(Integer, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    exercise = relationship("Exercise", back_populates="progress_history") 