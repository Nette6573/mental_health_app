Here's a comprehensive update for your GitHub README that accurately reflects your current project structure with Hugging Face integration, Railway backend, and Vercel frontend:

# 🧠 HopePath - Mental Health AI Assistant (Jamaica)

[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mental-health-app-cyan.vercel.app)
[![Railway](https://img.shields.io/badge/Railway-Backend-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-AI%20Model-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

A faith-based mental health support platform for Jamaica, combining AI-powered conversational support with professional resources.

## 🌟 Live Demo

- **Web Frontend**: [https://mental-health-app-cyan.vercel.app](https://mental-health-app-cyan.vercel.app)
- **Backend API**: Deployed on Railway
- **AI Model**: Hosted on Hugging Face Spaces

## 📋 Project Overview

HopePath provides accessible mental health support tailored for the Jamaican community, integrating:

- 💬 **AI Chat Assistant (Paula)** - Conversational support with Jamaican patois understanding
- 📖 **Faith-Based Guidance** - Scripture-based encouragement and support
- 🏥 **Professional Directory** - Licensed therapists and counselors across Jamaica
- 📱 **Mobile App** - React Native mobile application for iOS/Android

## 🏗️ Project Structure

```
mental_health_app/
├── frontend/                    # Next.js Web Application (Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── paula/          # Paula AI Chat Interface
│   │   │   ├── auth/           # Authentication Pages
│   │   │   └── page.tsx        # Landing Page
│   │   ├── context/             # React Context (Auth)
│   │   └── styles/              # Global Styles
│   ├── public/                   # Static Assets
│   └── package.json
│
├── paula_backend/                # FastAPI Backend (Railway)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI Application
│   │   ├── config.py             # Environment Configuration
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── chat.py           # Chat API Endpoints
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py           # Chat Data Models
│   │   │   └── message.py        # Message Pydantic Models
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── mongo.py           # MongoDB Connection
│   │   └── ai/
│   │       ├── __init__.py
│   │       └── paula_client.py    # Hugging Face API Integration
│   ├── requirements.txt
│   └── runtime.txt                 # Python Version
│
├── mobile/                         # React Native Mobile App
│   └── HealthApp/
│       ├── src/
│       ├── android/
│       └── ios/
│
├── data/                            # Training Datasets & JSON Files
│   ├── health_facilities.json       # Jamaican Health Facilities
│   └── training_data/
│
└── .vscode/                          # VS Code Configuration
```

## 🚀 Technology Stack

### Frontend (Vercel)

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Authentication**: Custom Auth Context
- **Deployment**: Vercel

### Backend (Railway)

- **Framework**: FastAPI
- **Database**: MongoDB Atlas
- **ORM**: PyMongo
- **Deployment**: Railway

### AI Integration (Hugging Face)

- **Model**: Meta Llama-3-8B-Instruct / DialoGPT
- **API**: Hugging Face Inference API
- **Hosting**: Hugging Face Spaces (for testing) / Railway (production)

### Mobile

- **Framework**: React Native
- **Platforms**: iOS & Android

## 💬 Paula AI Chat Features

- 🇯🇲 **Jamaican Patois Understanding** - Trained to understand local dialect
- 💾 **Conversation Memory** - Maintains chat history per user
- 🔐 **User Authentication** - Secure login/signup
- 📱 **Cross-Platform** - Works on web and mobile
- 📖 **Faith-Based Responses** - Integrates scripture and encouragement

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- Hugging Face account & API token

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Opens on http://localhost:3000
```

### Backend Setup

```bash
cd paula_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with:
# HF_TOKEN=your_huggingface_token
# MONGO_URI=your_mongodb_connection_string
# SECRET_KEY=your_secret_key

uvicorn app.main:app --reload
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

## 🔑 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000  # Or Railway URL in production
```

### Backend (.env)

```env
HF_TOKEN=hf_your_huggingface_token
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
SECRET_KEY=your_secret_key_here
```

## 📡 API Endpoints

| Method | Endpoint                                    | Description               |
| ------ | ------------------------------------------- | ------------------------- |
| GET    | `/health`                                   | Health check              |
| POST   | `/api/send?user_id={id}&chat_id={optional}` | Send message to Paula     |
| GET    | `/`                                         | Root welcome message      |
| GET    | `/docs`                                     | Swagger API documentation |

## 🚢 Deployment

### Backend (Railway)

1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Add `NEXT_PUBLIC_API_URL` environment variable
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Medical Council of Jamaica
- Jamaica Psychological Society
- Hugging Face for AI infrastructure
- MongoDB Atlas for database hosting

## 📞 Contact

Project Link: [https://github.com/Nette6573/mental_health_app](https://github.com/Nette6573/mental_health_app)

---

**Built with ❤️ for Jamaica**
