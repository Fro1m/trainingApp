from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class ExerciseBase(BaseModel):
    name: str
    sets: int
    reps: int

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseResponse(ExerciseBase):
    id: int
    current_weight: int
    last_weight: int
    record_weight: int
    muscle_group_id: int

    model_config = ConfigDict(from_attributes=True)

class MuscleGroupBase(BaseModel):
    name: str

class MuscleGroupCreate(MuscleGroupBase):
    exercises: List[ExerciseCreate]

class MuscleGroupResponse(MuscleGroupBase):
    id: int
    workout_id: int
    exercises: List[ExerciseResponse]

    model_config = ConfigDict(from_attributes=True)

class WorkoutBase(BaseModel):
    name: str

class WorkoutCreate(WorkoutBase):
    muscle_groups: List[MuscleGroupCreate]

class WorkoutResponse(WorkoutBase):
    id: int
    created_at: datetime
    updated_at: datetime
    muscle_groups: List[MuscleGroupResponse]

    model_config = ConfigDict(from_attributes=True)

class ExerciseProgressUpdate(BaseModel):
    current_weight: int
    last_weight: Optional[int] = None
    record_weight: Optional[int] = None

class ExerciseProgressResponse(BaseModel):
    id: int
    exercise_id: int
    weight: int
    date: datetime

    model_config = ConfigDict(from_attributes=True)

class ExerciseHistoryResponse(BaseModel):
    exercise: ExerciseResponse
    history: List[ExerciseProgressResponse] 