# Flask + React Training App

This is a basic web application using Flask for the backend and React for the frontend.

## Project Structure

```
trainingApp/
├── backend/           # Flask backend
│   ├── app.py        # Main Flask application
│   └── requirements.txt
└── frontend/         # React frontend
    ├── package.json
    └── src/
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on http://localhost:3000

## Development

- Backend API endpoints are available at http://localhost:5000/api/\*
- Frontend development server runs on http://localhost:3000
- The frontend is configured to proxy API requests to the backend
