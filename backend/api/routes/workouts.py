from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List
from ..database import get_db
from ..models.workout import Workout
from ..models.exercise import Exercise, WeightHistory
from ..schemas.workout import WorkoutCreate, Workout as WorkoutSchema, WorkoutStats, ScheduledWorkout
from ..schemas.exercise import WeightHistory as WeightHistorySchema
from ..dependencies.auth import get_current_user

router = APIRouter()

@router.post("/workouts/", response_model=WorkoutSchema)
def create_workout(
    workout: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_workout = Workout(
        **workout.dict(),
        user_id=current_user.id
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.get("/workouts/", response_model=List[WorkoutSchema])
def get_workouts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).all()
    return workouts

@router.get("/workouts/{workout_id}", response_model=WorkoutSchema)
def get_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@router.put("/workouts/{workout_id}", response_model=WorkoutSchema)
def update_workout(
    workout_id: int,
    workout: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()
    if not db_workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    for key, value in workout.dict().items():
        setattr(db_workout, key, value)
    
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.delete("/workouts/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted successfully"}

@router.post("/workouts/{workout_id}/complete", response_model=WorkoutSchema)
def complete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    workout.complete()
    db.commit()
    db.refresh(workout)
    return workout

@router.get("/workouts/stats", response_model=WorkoutStats)
def get_workout_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Get total workouts
    total_workouts = db.query(func.count(Workout.id)).filter(
        Workout.user_id == current_user.id
    ).scalar()

    # Get workouts this week
    week_start = datetime.utcnow() - timedelta(days=datetime.utcnow().weekday())
    this_week = db.query(func.count(Workout.id)).filter(
        Workout.user_id == current_user.id,
        Workout.created_at >= week_start
    ).scalar()

    # Get workouts this month
    month_start = datetime.utcnow().replace(day=1)
    this_month = db.query(func.count(Workout.id)).filter(
        Workout.user_id == current_user.id,
        Workout.created_at >= month_start
    ).scalar()

    # Get most frequent exercise
    most_frequent = db.query(
        Exercise.name,
        func.count(Exercise.id).label('count')
    ).join(Workout).filter(
        Workout.user_id == current_user.id
    ).group_by(Exercise.name).order_by('count DESC').first()

    # Get personal bests
    personal_bests = db.query(
        Exercise.name,
        func.max(Exercise.record_weight).label('max_weight')
    ).join(Workout).filter(
        Workout.user_id == current_user.id,
        Exercise.record_weight > 0
    ).group_by(Exercise.name).all()

    return WorkoutStats(
        total_workouts=total_workouts,
        this_week=this_week,
        this_month=this_month,
        most_frequent_exercise=most_frequent[0] if most_frequent else "No exercises yet",
        personal_bests=[{"exercise": name, "weight": weight} for name, weight in personal_bests]
    )

@router.post("/exercises/{exercise_id}/history", response_model=WeightHistorySchema)
def add_weight_history(
    exercise_id: int,
    weight: float,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify exercise belongs to user
    exercise = db.query(Exercise).join(Workout).filter(
        Exercise.id == exercise_id,
        Workout.user_id == current_user.id
    ).first()
    
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    weight_history = WeightHistory(
        exercise_id=exercise_id,
        weight=weight,
        date=datetime.utcnow()
    )
    
    db.add(weight_history)
    db.commit()
    db.refresh(weight_history)
    return weight_history

@router.get("/exercises/{exercise_id}/history", response_model=List[WeightHistorySchema])
def get_weight_history(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify exercise belongs to user
    exercise = db.query(Exercise).join(Workout).filter(
        Exercise.id == exercise_id,
        Workout.user_id == current_user.id
    ).first()
    
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    return db.query(WeightHistory).filter(
        WeightHistory.exercise_id == exercise_id
    ).order_by(WeightHistory.date.desc()).all()

@router.put("/workouts/{workout_id}/exercises/{exercise_id}/progress")
def update_exercise_progress(
    workout_id: int,
    exercise_id: int,
    progress_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify exercise belongs to user
    exercise = db.query(Exercise).join(Workout).filter(
        Exercise.id == exercise_id,
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()
    
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    # Update exercise weights
    exercise.current_weight = progress_data.get('current_weight', exercise.current_weight)
    exercise.last_weight = progress_data.get('last_weight', exercise.last_weight)
    exercise.record_weight = progress_data.get('record_weight', exercise.record_weight)

    # Add to weight history
    weight_history = WeightHistory(
        exercise_id=exercise_id,
        weight=exercise.current_weight,
        date=datetime.utcnow()
    )
    
    db.add(weight_history)
    db.commit()
    db.refresh(exercise)
    return exercise 