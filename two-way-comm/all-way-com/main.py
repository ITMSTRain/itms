from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import supabase
import cv2
import threading

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this to your frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Supabase Client Setup
SUPABASE_URL = "https://jplabypqlbviskgkxapf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbGFieXBxbGJ2aXNrZ2t4YXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMTg2NTgsImV4cCI6MjA1MzY5NDY1OH0.yWbJOxhJRZ0eI-IAQr2tRMK3rTHGTrYbw4Q9xp1d9XI"
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# Dictionary to store active video streams
video_streams = {}

class VideoRequest(BaseModel):
    video_names: list[str]

def fetch_videos(video_names):
    """Fetch available videos from the database."""
    print(f"Fetching videos for: {video_names}")  # Debugging line

    response = supabase_client.table("videos").select("video_name, video_link").in_("video_name", video_names).execute()
    
    if response.data:
        print(f"Fetched videos: {response.data}")  # Debugging line
        return response.data
    else:
        print("No videos found.")  # Debugging line
        return []

def generate_frames(video_name, video_path):
    """Process video frames and store the generator in the stream dictionary."""
    def frame_generator():
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            print(f"ERROR: Could not open video {video_name}")  # Debugging
            return

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            _, buffer = cv2.imencode(".jpg", frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

        cap.release()

    # Store generator function in the dictionary
    video_streams[video_name] = frame_generator

@app.post("/generate_video_endpoints")
async def generate_video_endpoints(request: VideoRequest):
    """Fetch available videos, start processing, and create streaming endpoints."""
    videos = fetch_videos(request.video_names)

    if not videos:
        return {"message": "No videos found", "endpoints": []}  # Avoid raising 404, just return empty

    endpoints = []
    for video in videos:
        video_name = video["video_name"]
        video_path = video["video_link"]

        print(f"Starting stream for {video_name} from {video_path}")  # Debugging line

        # Start processing video and store frame generator
        thread = threading.Thread(target=generate_frames, args=(video_name, video_path))
        thread.start()

        endpoints.append(f"http://localhost:8000/videos/{video_name}")

    return {
        "message": "Video streaming started, endpoints generated",
        "endpoints": endpoints
    }

@app.get("/videos/{video_name}")
async def stream_video(video_name: str):
    """Stream the requested video if available."""
    if video_name not in video_streams:
        raise HTTPException(status_code=404, detail="Video not found or not started")

    return StreamingResponse(video_streams[video_name](), media_type="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)