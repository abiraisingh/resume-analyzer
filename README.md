# Resume Analyzer

A full-stack AI-powered resume analyzer web application.

## Features

- Resume upload (PDF/DOCX)
- AI analysis of resume content
- Job matching with similarity scoring
- User authentication
- History of analyses
- Modern UI with Tailwind CSS

## Tech Stack

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- AI Service: Python, FastAPI, spaCy, scikit-learn

## Setup

### Prerequisites

- Node.js
- Python 3.8+
- MongoDB
- npm/yarn

### Backend

1. cd backend
2. npm install
3. npm start

### AI Service

1. cd ai-service
2. pip install -r requirements.txt
3. uvicorn main:app --reload

### Frontend

1. cd frontend
2. npm install
3. npm start

### MongoDB

Ensure MongoDB is running on localhost:27017.

## Usage

1. Register/Login
2. Upload resume
3. View analysis
4. Create job descriptions and match