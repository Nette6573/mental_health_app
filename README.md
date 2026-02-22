# 🧠 HopePath - Mental Health AI Assistant (Jamaica)

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-Frontend-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://hopepath.online)
[![Railway](https://img.shields.io/badge/Railway-Backend-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-AI%20Model-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

A faith-based mental health support platform for Jamaica, combining AI-powered conversational support with professional resources.

## 🌟 Live Demo

- **Web Application**: [https://hopepath.online](https://hopepath.online)
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
├── frontend/ # Next.js Web Application (Cloudflare Pages)
│ ├── src/
│ │ ├── app/
│ │ │ ├── paula/ # Paula AI Chat Interface
│ │ │ ├── auth/ # Authentication Pages
│ │ │ └── page.tsx # Landing Page
│ │ ├── context/ # React Context (Auth)
│ │ └── styles/ # Global Styles
│ ├── public/ # Static Assets
│ └── package.json
│
├── paula_backend/ # FastAPI Backend (Railway)
│ ├── app/
│ │ ├── init.py
│ │ ├── main.py # FastAPI Application
│ │ ├── config.py # Environment Configuration
│ │ ├── routes/
│ │ │ ├── init.py
│ │ │ └── chat.py # Chat API Endpoints
│ │ ├── models/
│ │ │ ├── init.py
│ │ │ ├── chat.py # Chat Data Models
│ │ │ └── message.py # Message Pydantic Models
│ │ ├── db/
│ │ │ ├── init.py
│ │ │ └── mongo.py # MongoDB Connection
│ │ └── ai/
│ │ ├── init.py
│ │ └── paula_client.py # Hugging Face API Integration
│ ├── requirements.txt
│ └── runtime.txt # Python Version
│
├── mobile/ # React Native Mobile App
│ └── HealthApp/
│ ├── src/
│ ├── android/
│ └── ios/
│
├── data/ # Training Datasets & JSON Files
│ ├── health_facilities.json # Jamaican Health Facilities
│ └── training_data/
│
└── .vscode/ # VS Code Configuration
```

## 🚀 Technology Stack

### Frontend (Cloudflare Pages)

- **Framework**: Next.js 14 (React) with static export
- **Styling**: Tailwind CSS
- **Authentication**: Custom Auth Context
- **Deployment**: Cloudflare Pages
- **Domain**: [https://hopepath.online](https://hopepath.online)

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
# Opens on http://localhost:3000**
```

### Backend Setup

```bash

cd paula_backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with:
# HF_TOKEN=your_huggingface_token
# MONGO_URI=your_mongodb_connection_string
# SECRET_KEY=your_secret_key

uvicorn app.main:app --reload
#API at http://localhost:8000**
#Docs at http://localhost:8000/docs**
```

## 🔑 Environment Variables

### Frontend (.env.local)

```env
  NEXT_PUBLIC_API_URL=https://your-backend.railway.app # Railway URL in production
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

### Frontend (Cloudflare Pages)

1.Push code to GitHub
2.Connect repository to Cloudflare Pages
3.Configure build settings:
**Build command**: cd frontend && npm install && npm run build
**Build output directory**: frontend/out
4.Add NEXT_PUBLIC_API_URL environment variable with your Railway backend URL
5.Deploy automatically on push
6.Connect custom domain hopepath.online in Cloudflare Pages dashboard

### Backend (Railway)

1.Push code to GitHub
2.Connect repository to Railway
3.Add environment variables in Railway dashboard
4.Deploy automatically

## 🤝 Contributing

1.Fork the repository
2.Create your feature branch (git checkout -b feature/AmazingFeature)
3.Commit changes (git commit -m 'Add AmazingFeature')
4.Push to branch (git push origin feature/AmazingFeature)
5.Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Medical Council of Jamaica
- Jamaica Psychological Society
- Hugging Face for AI infrastructure
- MongoDB Atlas for database hosting
- Cloudflare for hosting and DNS services
- Namecheap for domain registration

## 📞 Contact

Project Link: https://github.com/Nette6573/mental_health_app

Live Site: https://hopepath.online

---

**Built with ❤️ for Jamaica**

```

```
