import os
import sys

# Get the absolute path of the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
# Add the backend directory to Python path
sys.path.insert(0, backend_dir)

# Now import and run init_db
from init_db import init_db

if __name__ == "__main__":
    init_db()
    print("Database initialized with sample data") 