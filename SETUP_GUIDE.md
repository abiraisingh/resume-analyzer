# Resume Analyzer - Complete Setup & Run Guide

A full-stack AI-powered resume analyzer web application built with React, Node.js, FastAPI, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ (https://nodejs.org/)
- **Python** 3.8+ (https://www.python.org/)
- **MongoDB** running locally (https://www.mongodb.com/try/download/community)
- npm/yarn package manager

### Step 1: Install MongoDB

Download and install MongoDB Community Edition from: https://www.mongodb.com/try/download/community

**Windows:**
- Run the installer
- Choose "Install MongoDB as a Service"
- MongoDB will start automatically

**Verify MongoDB is running:**
```bash
mongo
```

### Step 2: Backend Setup

```bash
cd d:\resume-analyzer\backend

# Install dependencies
npm install

# Start the backend server (development mode)
npm run dev
```

You should see: `Server running on port 5000`

### Step 3: AI Service Setup

Open a new terminal:

```bash
cd d:\resume-analyzer\ai-service

# Create Python virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the AI service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see: `Uvicorn running on http://0.0.0.0:8000`

### Step 4: Frontend Setup

Open a new terminal:

```bash
cd d:\resume-analyzer\frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open automatically at `http://localhost:3000`

## 🔐 First Time Usage

1. **Register** at `http://localhost:3000/register`
   - Username: testuser
   - Email: test@example.com
   - Password: password123

2. **Login** with your credentials

3. **Upload a Resume** (PDF or DOCX format)

4. **View Analysis** on the dashboard

## 📋 File Structure

```
resume-analyzer/
├── frontend/                 # React app
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── App.js           # Main app with routing
│   │   └── index.js         # React entry point
│   ├── public/
│   │   └── index.html       # HTML template
│   └── package.json
│
├── backend/                  # Node.js/Express API
│   ├── routes/              # API endpoints
│   ├── models/              # MongoDB schemas
│   ├── middleware/          # Auth middleware
│   ├── server.js            # Express server
│   ├── .env                 # Environment variables
│   └── package.json
│
└── ai-service/              # Python/FastAPI service
    ├── main.py              # FastAPI app
    ├── requirements.txt     # Python dependencies
    └── .env                 # Environment variables
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### AI Service (.env)
```
# No environment variables required for basic setup
```

## 📱 Features

- **User Authentication**: JWT-based login/signup
- **Resume Upload**: Drag & drop PDF/DOCX support
- **AI Analysis**: Extract skills, education, experience
- **ATS Scoring**: Calculate resume match score (0-100%)
- **Job Matching**: Compare resume with job descriptions
- **Dashboard**: Modern UI with Tailwind CSS
- **History**: View all previous analyses

## 🛠️ Troubleshooting

### Frontend won't start
```bash
# Clear npm cache and node_modules
rm -r node_modules package-lock.json
npm install
npm start
```

### MongoDB connection error
- Ensure MongoDB is running: `mongod` or check Services on Windows
- Verify MONGO_URI in `.env`

### AI Service port already in use
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Backend won't connect to AI service
- Ensure AI service is running on port 8000
- Check firewall settings
- Verify API URLs in backend routes

### Login keeps failing
- Ensure backend is running
- Check MongoDB connection
- Verify JWT_SECRET in `.env`

## 🚢 Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the `build` folder
```

### Backend (Heroku/Railway/Render)
- Set environment variables
- Deploy from Git

### AI Service (Railway/Render)
- Deploy Python app with `requirements.txt`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume` - Get user's resumes

### Job Matching
- `POST /api/job` - Create job description
- `GET /api/job` - Get user's jobs
- `POST /api/job/match` - Match resume with job

## 🎨 Customization

### Colors & Styling
Edit `tailwind.config.js` in frontend folder

### Skills Database
Update skill list in `ai-service/main.py` `extract_skills()` function

### ATS Score Algorithm
Modify `calculate_ats_score()` in `ai-service/main.py`

## 📝 Notes

- Resume parsing supports PDF and DOCX files
- AI service uses TF-IDF for similarity scoring
- All data is stored in MongoDB
- JWT tokens expire in 1 hour
- Resumes are stored as text in MongoDB

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review terminal error messages
3. Ensure all services are running
4. Check MongoDB connection
