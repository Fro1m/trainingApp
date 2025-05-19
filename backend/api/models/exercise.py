from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    muscle_group_id = Column(Integer, ForeignKey("muscle_groups.id"))
    sets = Column(Integer, default=3)
    reps = Column(Integer, default=10)
    current_weight = Column(Float, default=0)
    last_weight = Column(Float, default=0)
    record_weight = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    muscle_group = relationship("MuscleGroup", back_populates="exercises")
    weight_history = relationship("WeightHistory", back_populates="exercise", cascade="all, delete-orphan")

class WeightHistory(Base):
    __tablename__ = "weight_history"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    weight = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    exercise = relationship("Exercise", back_populates="weight_history") 