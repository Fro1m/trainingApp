from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class WeightHistoryBase(BaseModel):
    weight: float
    date: datetime

class WeightHistoryCreate(WeightHistoryBase):
    pass

class WeightHistory(WeightHistoryBase):
    id: int
    exercise_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    sets: int
    reps: int
    current_weight: float
    last_weight: float
    record_weight: float

class Exercise(ExerciseBase):
    id: int
    workout_id: int
    muscle_group_id: int
    created_at: datetime
    updated_at: datetime
    weight_history: List[WeightHistory]

    class Config:
        from_attributes = True

class MuscleGroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class MuscleGroup(MuscleGroupBase):
    id: int
    exercises: List[Exercise]

    class Config:
        from_attributes = True

class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None
    scheduled_date: Optional[datetime] = None

class WorkoutCreate(WorkoutBase):
    pass

class Workout(WorkoutBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    is_completed: bool
    completed_at: Optional[datetime] = None
    muscle_groups: List[MuscleGroup]

    class Config:
        from_attributes = True

class WorkoutStats(BaseModel):
    total_workouts: int
    this_week: int
    this_month: int
    most_frequent_exercise: str
    personal_bests: List[dict]

class ScheduledWorkout(BaseModel):
    id: int
    name: str
    scheduled_date: datetime
    is_completed: bool

    class Config:
        from_attributes = True 