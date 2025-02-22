import cv2
import time
import asyncio
from fastapi import FastAPI, Request
from fastapi.responses import  StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins like ["http://localhost"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DESIRED_FPS = 30

# Example configurations
class_colors = {0: (0, 255, 0), 1: (255, 0, 0)}
class_names = {0: 'Car', 1: 'Truck'}

# Store video paths received from the frontend
video_paths = {}

class VideoRequest(BaseModel):
    video_path: str

@app.post("/set_video/{video_id}")
async def set_video(video_id: str, request: VideoRequest):
    """Store the video path received from JavaScript"""
    video_paths[video_id] = request.video_path
    return {"message": "Video path set", "video_id": video_id, "video_path": request.video_path}

async def process_video(video_path):
    """Process the video and stream frames"""
    cap = cv2.VideoCapture(video_path)
    frame_interval = 1.0 / DESIRED_FPS
    prev_time = time.time()

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            current_time = time.time()
            elapsed = current_time - prev_time
            if elapsed < frame_interval:
                await asyncio.sleep(frame_interval - elapsed)
                continue

            prev_time = current_time

            # Resize frame for streaming
            small_frame = cv2.resize(frame, (480, 320))
            _, encoded_image = cv2.imencode('.jpg', small_frame)

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' +
                   encoded_image.tobytes() +
                   b'\r\n')

    finally:
        cap.release()

@app.get("/video_feed/{video_id}")
async def video_feed(video_id: str):
    """Stream video based on the stored video path"""
    video_path = video_paths.get(video_id)
    if not video_path:
        return {"error": "No video path set for this ID"}

    return StreamingResponse(process_video(video_path),
                             media_type="multipart/x-mixed-replace; boundary=frame")

# Run Uvicorn if this script is executed directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)