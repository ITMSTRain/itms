from fastapi import APIRouter, Request, Depends, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse
from ..supabase_databse import supabase, SUPABASE_BUCKET, SUPABASE_URL

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def read(request: Request):
    response = supabase.table("users").select('*').eq('is_active', True).execute()
    data = response.data
    return