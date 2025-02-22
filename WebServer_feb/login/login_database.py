from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv("https://wcdscmlpgtstfwuagutt.supabase.co")
SUPABASE_KEY = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZHNjbWxwZ3RzdGZ3dWFndXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMjE2NDAsImV4cCI6MjA1MzY5NzY0MH0.BrYUgkRLDsx0lOccC0x2IlNsi0RzoMDgu0SfgJCCuwI")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) # type: ignore

app = FastAPI()

# Pydantic models for request validation
class UserSignup(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/signup")
async def signup(user: UserSignup):
    """Sign up a new user."""
    try:
        response = supabase.auth.sign_up({"email": user.email, "password": user.password})
        return {"message": "User signed up successfully", "user": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login")
async def login(user: UserLogin):
    """Log in an existing user."""
    try:
        response = supabase.auth.sign_in_with_password({"email": user.email, "password": user.password})
        if response.get("error"): # type: ignore
            raise HTTPException(status_code=400, detail=response["error"]) # type: ignore
        return {"message": "Login successful", "session": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
 
@app.get("/profile")
async def get_profile(user_id: str):
    """Fetch the user profile from the database."""
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
