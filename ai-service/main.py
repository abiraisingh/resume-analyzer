from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

nltk.download('punkt', quiet=True)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str

class MatchRequest(BaseModel):
    resumeText: str
    jobText: str

def extract_skills(text):
    # Simple skill extraction based on keyword matching
    common_skills = [
        'python', 'javascript', 'typescript', 'react', 'vue', 'angular',
        'node.js', 'express', 'django', 'flask', 'fastapi',
        'mongodb', 'sql', 'postgres', 'mysql', 'firebase',
        'java', 'c++', 'c#', '.net', 'go', 'rust',
        'docker', 'kubernetes', 'aws', 'azure', 'gcp',
        'git', 'jenkins', 'ci/cd', 'agile', 'scrum',
        'html', 'css', 'tailwind', 'bootstrap', 'material',
        'rest api', 'graphql', 'websocket', 'grpc',
        'linux', 'windows', 'macos', 'bash', 'powershell'
    ]
    text_lower = text.lower()
    found = [skill for skill in common_skills if skill in text_lower]
    return list(set(found))  # Remove duplicates

def extract_sections(text):
    # Simple section extraction using regex
    education_match = re.search(r'(?:education|educational background)[:\n]*(.*?)(?:\n\n|\n[A-Z]|$)', text, re.IGNORECASE | re.DOTALL)
    experience_match = re.search(r'(?:experience|work experience|professional experience)[:\n]*(.*?)(?:\n\n|\n[A-Z]|$)', text, re.IGNORECASE | re.DOTALL)
    projects_matches = re.findall(r'(?:project|projects)[:\n]*(.*?)(?:\n\n|\n[A-Z]|$)', text, re.IGNORECASE | re.DOTALL)
    
    return {
        'education': education_match.group(1).strip()[:200] if education_match else 'Not found',
        'experience': experience_match.group(1).strip()[:200] if experience_match else 'Not found',
        'projects': [p.strip()[:100] for p in projects_matches] if projects_matches else []
    }

def calculate_ats_score(text, job_desc=''):
    # ATS score based on presence of key resume elements
    score = 0
    max_score = 100
    
    # Check for key sections
    if re.search(r'\b(education|degree|bachelor|master)\b', text, re.IGNORECASE):
        score += 15
    if re.search(r'\b(experience|worked|developed|managed)\b', text, re.IGNORECASE):
        score += 20
    if re.search(r'\b(skills|proficient|expertise|languages)\b', text, re.IGNORECASE):
        score += 15
    if re.search(r'\b(project|built|created|designed)\b', text, re.IGNORECASE):
        score += 15
    if re.search(r'\b(achievement|accomplished|improved|increased)\b', text, re.IGNORECASE):
        score += 15
    if re.search(r'\b(\d+%|\d+\+?years?)\b', text):
        score += 10
    if re.search(r'\b(email|phone|linkedin|github)\b', text, re.IGNORECASE):
        score += 10
    
    return min(score, max_score)

def find_missing_keywords(resume_text, job_text):
    job_words = set(job_text.lower().split())
    resume_words = set(resume_text.lower().split())
    missing = sorted(job_words - resume_words, key=lambda x: len(x), reverse=True)
    return missing[:15]  # Top 15 missing keywords

@app.post('/analyze')
def analyze_resume(request: AnalyzeRequest):
    text = request.text
    sections = extract_sections(text)
    skills = extract_skills(text)
    ats_score = calculate_ats_score(text)
    
    recommendations = []
    if ats_score < 50:
        recommendations.append('Add more quantifiable achievements with metrics')
    if len(skills) < 5:
        recommendations.append('Highlight more technical skills and tools you know')
    if 'education' not in sections or sections['education'] == 'Not found':
        recommendations.append('Add an Education section with degree and institution')
    if 'experience' not in sections or sections['experience'] == 'Not found':
        recommendations.append('Add a Work Experience section with role descriptions')
    
    recommendations.append('Use action verbs (developed, managed, implemented, etc.)')
    recommendations.append('Include specific technologies and frameworks you used')
    
    return {
        'skills': skills,
        'education': sections['education'],
        'experience': sections['experience'],
        'projects': sections['projects'],
        'atsScore': ats_score,
        'missingKeywords': [],
        'recommendations': recommendations
    }

@app.post('/match')
def match_resume(request: MatchRequest):
    resume = request.resumeText
    job = request.jobText
    
    try:
        vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        tfidf = vectorizer.fit_transform([resume, job])
        similarity = float(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]) * 100
    except:
        similarity = 0.0
    
    missing_skills = find_missing_keywords(resume, job)
    
    return {
        'matchPercentage': round(similarity, 2),
        'missingSkills': missing_skills[:10]  # Top 10
    }

@app.get('/health')
def health_check():
    return {'status': 'ok'}