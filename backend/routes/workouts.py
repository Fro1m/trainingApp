from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db
from models.workout import Workout, MuscleGroup, Exercise, ExerciseProgress
from schemas.workout import (
    WorkoutCreate,
    WorkoutResponse,
    ExerciseProgressUpdate,
    ExerciseHistoryResponse
)

router = APIRouter()

@router.get("/workouts", response_model=List[WorkoutResponse])
def get_workouts(db: Session = Depends(get_db)):
    workouts = db.query(Workout).all()
    return workouts

@router.post("/workouts", response_model=WorkoutResponse)
def create_workout(workout: WorkoutCreate, db: Session = Depends(get_db)):
    db_workout = Workout(name=workout.name)
    db.add(db_workout)
    db.flush()

    for muscle_group_data in workout.muscle_groups:
        db_muscle_group = MuscleGroup(
            name=muscle_group_data.name,
            workout_id=db_workout.id
        )
        db.add(db_muscle_group)
        db.flush()

        for exercise_data in muscle_group_data.exercises:
            db_exercise = Exercise(
                name=exercise_data.name,
                sets=exercise_data.sets,
                reps=exercise_data.reps,
                muscle_group_id=db_muscle_group.id
            )
            db.add(db_exercise)

    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.put("/workouts/{workout_id}/exercises/{exercise_id}/progress")
def update_exercise_progress(
    workout_id: int,
    exercise_id: int,
    progress: ExerciseProgressUpdate,
    db: Session = Depends(get_db)
):
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.muscle_group.has(workout_id=workout_id)
    ).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    # Update exercise weights
    if progress.last_weight is not None:
        exercise.last_weight = progress.last_weight
    else:
        exercise.last_weight = exercise.current_weight

    exercise.current_weight = progress.current_weight

    if progress.record_weight is not None:
        exercise.record_weight = progress.record_weight
    elif progress.current_weight > exercise.record_weight:
        exercise.record_weight = progress.current_weight

    # Add to progress history
    progress_entry = ExerciseProgress(
        exercise_id=exercise_id,
        weight=progress.current_weight
    )
    db.add(progress_entry)

    db.commit()
    return {"message": "Progress updated successfully"}

@router.get("/exercises/{exercise_id}/history", response_model=ExerciseHistoryResponse)
def get_exercise_history(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    history = db.query(ExerciseProgress)\
        .filter(ExerciseProgress.exercise_id == exercise_id)\
        .order_by(ExerciseProgress.date.desc())\
        .all()

    return {
        "exercise": exercise,
        "history": history
    } 