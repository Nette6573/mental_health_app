# app/routes/auth.py
from fastapi import APIRouter, HTTPException, status
from datetime import datetime
import logging
from typing import Optional
from pydantic import BaseModel, EmailStr

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

# Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: str
    email: EmailStr
    name: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

# Try to import MongoDB
try:
    from app.db.mongo import users
    DB_AVAILABLE = users is not None
except Exception as e:
    logger.warning(f"MongoDB not available for auth: {e}")
    DB_AVAILABLE = False
    users = None

# Simple in-memory storage for when MongoDB is not available
IN_MEMORY_USERS = {}

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    logger.info(f"Registration attempt for {user_data.email}")
    
    # Try database first
    if DB_AVAILABLE and users is not None:
        try:
            # Check if user already exists
            existing_user = users.find_one({"email": user_data.email})
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            
            # Create new user
            user_id = f"user_{int(datetime.utcnow().timestamp())}"
            
            new_user = {
                "user_id": user_id,
                "email": user_data.email,
                "name": user_data.name,
                "hashed_password": f"temp_{user_data.password}",  # In production, hash properly
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "is_active": True
            }
            
            result = users.insert_one(new_user)
            
            return UserResponse(
                user_id=user_id,
                email=user_data.email,
                name=user_data.name,
                created_at=new_user["created_at"]
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Registration error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Registration failed. Please try again."
            )
    else:
        # Fallback to in-memory storage
        if user_data.email in IN_MEMORY_USERS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        user_id = f"user_{len(IN_MEMORY_USERS) + 1}"
        IN_MEMORY_USERS[user_data.email] = {
            "user_id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "created_at": datetime.utcnow()
        }
        
        return UserResponse(
            user_id=user_id,
            email=user_data.email,
            name=user_data.name,
            created_at=datetime.utcnow()
        )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user"""
    logger.info(f"Login attempt for {user_data.email}")
    
    # Try database first
    if DB_AVAILABLE and users is not None:
        try:
            # Find user
            user = users.find_one({"email": user_data.email})
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            
            # For development, accept any password
            # In production, verify password properly
            
            access_token = f"temp_token_{user['user_id']}"
            
            return Token(
                access_token=access_token,
                token_type="bearer"
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Login error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Login failed. Please try again."
            )
    else:
        # Fallback to in-memory storage
        if user_data.email not in IN_MEMORY_USERS:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        return Token(
            access_token=f"temp_token_{IN_MEMORY_USERS[user_data.email]['user_id']}",
            token_type="bearer"
        )

@router.get("/health")
async def auth_health():
    """Health check for auth service"""
    return {
        "status": "auth service running",
        "database_available": DB_AVAILABLE,
        "timestamp": datetime.utcnow().isoformat()
    }