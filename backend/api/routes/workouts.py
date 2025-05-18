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
def create_workout(workout: WorkoutCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_workout = Workout(
        **workout.dict(),
        user_id=current_user.id
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.get("/workouts/", response_model=List[WorkoutSchema])
def get_workouts(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Workout).filter(Workout.user_id == current_user.id).all()

@router.get("/workouts/scheduled", response_model=List[ScheduledWorkout])
def get_scheduled_workouts(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.scheduled_date.isnot(None)
    ).all()

@router.get("/workouts/stats", response_model=WorkoutStats)
def get_workout_stats(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Get total workouts
    total_workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.is_completed == True
    ).count()

    # Get this week's workouts
    week_ago = datetime.utcnow() - timedelta(days=7)
    this_week = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.is_completed == True,
        Workout.completed_at >= week_ago
    ).count()

    # Get this month's workouts
    month_ago = datetime.utcnow() - timedelta(days=30)
    this_month = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.is_completed == True,
        Workout.completed_at >= month_ago
    ).count()

    # Get most frequent exercise
    most_frequent = db.query(
        Exercise.name,
        func.count(Exercise.id).label('count')
    ).join(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.is_completed == True
    ).group_by(Exercise.name).order_by(func.count(Exercise.id).desc()).first()

    # Get personal bests
    personal_bests = []
    exercises = db.query(Exercise).join(Workout).filter(
        Workout.user_id == current_user.id
    ).distinct().all()

    for exercise in exercises:
        max_weight = db.query(func.max(WeightHistory.weight)).filter(
            WeightHistory.exercise_id == exercise.id
        ).scalar()
        
        if max_weight:
            current_weight = db.query(WeightHistory.weight).filter(
                WeightHistory.exercise_id == exercise.id
            ).order_by(WeightHistory.date.desc()).first()[0]
            
            personal_bests.append({
                "exercise": exercise.name,
                "current": current_weight,
                "record": max_weight
            })

    return WorkoutStats(
        total_workouts=total_workouts,
        this_week=this_week,
        this_month=this_month,
        most_frequent_exercise=most_frequent[0] if most_frequent else "No exercises yet",
        personal_bests=personal_bests
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