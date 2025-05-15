# Training App

A modern web application for tracking workouts, nutrition, and progress, built with Flask and React.

## Features

- 🏋️‍♂️ Workout tracking
- 🥗 Nutrition planning
- ⚖️ Weight monitoring
- 📸 Progress photos
- 📱 Mobile-first design
- ✋ Touch gestures support
- 🌐 RTL support for Hebrew

## Tech Stack

### Backend

- Flask (Python)
- Flask-CORS
- Python-dotenv

### Frontend

- React
- Material-UI
- React-Swipeable
- Axios

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Setup

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask server:
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

## Mobile Features

- Swipe right to select a category
- Swipe left to dismiss
- Touch-friendly interface
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
