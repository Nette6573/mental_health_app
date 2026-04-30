# 🧠 HopePath - AI-Powered Mental Wellness Support Platform

[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-DNS-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://cloudflare.com)
[![Railway](https://img.shields.io/badge/Railway-Backend-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)

> *"Walking with you towards healing and hope"*

HopePath is an AI-powered mental wellness support web application designed to provide accessible emotional support, behavioural insights, and connections to professional care. The platform integrates conversational AI, mood tracking, and therapist access into a unified system.

## 🌟 Live Demo

- **Web Application**: [https://hopepath.online](https://hopepath.online)
- **Backend API**: Deployed on Railway
- **AI Assistant (Paula)**: Integrated conversational support

## 📋 Project Overview

HopePath addresses the global mental health accessibility gap by offering:

- 💬 **AI-Driven Emotional Support** - Conversational AI assistant (Paula)
- 📊 **Mood Tracking & Behavioural Insights** - Self-awareness tools with pattern analysis
- 🏥 **Therapist Directory** - Access to licensed mental health professionals
- 📱 **User Dashboard** - Centralized interface for all features

The platform serves as a **first-line support system**, encouraging users to reflect, track their emotional state, and seek appropriate help when needed.

## 🎯 Key Objectives

- Implement secure user authentication
- Develop an AI support assistant (Paula)
- Enable mood tracking and behavioural insights
- Create a therapist/provider directory
- Support communication between users and providers
- Ensure secure data handling and storage

## 🏗️ Project Structure
hopepath/
├── frontend/ # Next.js Web Application
│ ├── src/
│ │ ├── app/ # App router pages
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # React Context (Auth)
│ │ └── styles/ # Global styles
│ ├── public/ # Static assets
│ └── package.json
│
├── backend/ # FastAPI Backend
│ ├── app/
│ │ ├── main.py # FastAPI application
│ │ ├── config.py # Environment configuration
│ │ ├── routes/ # API endpoints
│ │ ├── models/ # Data models
│ │ ├── db/ # Database connection
│ │ └── ai/ # AI integration layer
│ ├── requirements.txt
│ └── runtime.txt
│
├── mobile/ # React Native Mobile App
│ └── HealthApp/
│
└── data/ # Training datasets

text

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **DNS Management**: Cloudflare
- **Domain**: hopepath.online (registered via Namecheap)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB Atlas (chat + behavioural data)
- **Authentication**: Firebase
- **Media Storage**: Cloudinary
- **Deployment**: Railway

### AI Layer
- **Assistant**: Paula (context-aware emotional support engine)
- **Capabilities**: Emotion detection, pattern recognition, crisis detection
- **Safety**: Non-diagnostic, encourages professional help

## 💬 Paula AI Assistant Features

- 🧠 **Emotion Detection** - Identifies user emotional state
- 📝 **Context Awareness** - Maintains conversation context
- 📊 **Pattern Recognition** - Learns from user interactions
- 🔄 **Proactive Engagement** - Initiates supportive check-ins
- 🛡️ **Safety Design** - Crisis detection and escalation
- 💪 **Coping Strategies** - Provides grounding techniques and reflective questioning

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB Atlas account
- Firebase project setup
- Cloudinary account

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
Opens on http://localhost:3000

Backend Setup
bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
API at http://localhost:8000 | Docs at http://localhost:8000/docs

🔑 Environment Variables
Frontend (.env.local)
env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
Backend (.env)
env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hopepath
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_ADMIN_KEY=your_firebase_admin_key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
AI_API_KEY=your_huggingface_token
📡 API Endpoints
Method	Endpoint	Description
POST	/api/chat	AI interaction with Paula
GET	/api/user	Retrieve user data
POST	/api/mood	Log mood entries
GET	/api/insights	Return behavioural analytics
POST	/api/bookings	Handle therapist booking
GET	/health	Health check
🔐 Authentication Flow
User signs up via Firebase Authentication

Firebase returns unique UID

UID used across system for identity

Backend validates all requests using UID

🚢 Deployment
Frontend (Vercel + Cloudflare DNS)
Push code to GitHub

Connect repository to Vercel

Configure build settings in Vercel:

Build command: cd frontend && npm install && npm run build

Output directory: frontend/out

Install command: cd frontend && npm install

Add NEXT_PUBLIC_API_URL environment variable with Railway backend URL

Deploy automatically on push to main branch

DNS Configuration (Cloudflare):

Set up Cloudflare as DNS provider for hopepath.online

Add CNAME record pointing to Vercel deployment (vercel-dns.com)

Enable Cloudflare proxy (orange cloud) for CDN and DDoS protection

Configure SSL/TLS settings to Full or Full (Strict)

Backend (Railway)
Push code to GitHub

Connect repository to Railway

Add all environment variables in Railway dashboard

Deploy automatically on push

📊 System Architecture
text
User → Cloudflare DNS → Vercel (Frontend) → Railway (Backend) → MongoDB/Firebase
                              ↓                       ↓
                          Cloudinary              AI Layer (Paula)
🔒 Security & Ethical Considerations
✅ Secure authentication (Firebase)

✅ HTTPS for all endpoints (enforced by Vercel & Cloudflare)

✅ Encrypted data handling

✅ Minimal data collection policy

✅ Non-diagnostic AI design

✅ Crisis escalation mechanisms

✅ No exposure of API keys

✅ DDoS protection via Cloudflare

📱 Future Improvements
Real-time messaging with WebSockets

Appointment scheduling system

Enhanced AI intelligence and personalization

Native mobile application (React Native)

Predictive analytics for early intervention

Caching layer for performance optimization

🤝 Team Collaboration
Role	Contributor	Responsibilities
Project Manager / AI Development	Antoinette Thompson	System coordination, AI integration, backend development
Frontend Developer / UI/UX	Breanne Ricketts	User interface design, usability, responsiveness
Security Specialist / Database	Shamar Thomas	Authentication, security, provider/admin dashboards
Testing / Documentation Support	Kevaughn Golding	Testing, documentation, frontend refinements
🙏 Acknowledgments
Medical Council of Jamaica

Jamaica Psychological Society

Hugging Face for AI infrastructure

MongoDB Atlas for database hosting

Firebase for authentication services

Cloudinary for media storage

Vercel for frontend hosting

Cloudflare for DNS and security services

Railway for backend hosting

Namecheap for domain registration

📞 Contact
Project Repository: https://github.com/Nette6573/mental_health_app

Live Site: https://hopepath.online

Built with ❤️ for Jamaica | Walking with you towards healing and hope
