import cv2
from ultralytics import YOLO
import torch
import sys
import time
import json
import asyncio
from speed_calculator import SpeedCalculator
import os
from dotenv import load_dotenv
from supabase import create_client

from tracker import Tracker

from fastapi import FastAPI, WebSocket
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse, RedirectResponse
from fastapi.exceptions import HTTPException
from fastapi.staticfiles import StaticFiles




from io import BytesIO
import socket



from fastapi.middleware.cors import CORSMiddleware

import numpy as np

import uvicorn
import webbrowser
import threading
import os

from pydantic import BaseModel

load_dotenv()  # Load values from .env


# Parse JSON string from .env
try:
    allowed_origins = json.loads(os.getenv("ALLOWED_ORIGINS", "[]"))
except json.JSONDecodeError:
    raise ValueError("Invalid JSON in ALLOWED_ORIGINS environment variable")

# Make sure it's a list of strings
if not isinstance(allowed_origins, list) or not all(isinstance(origin, str) for origin in allowed_origins):
    raise TypeError("ALLOWED_ORIGINS must be a JSON array of strings")


app = FastAPI()


origins = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
# Load the YOLO model
model = YOLO(r'..\model_feb\94%.pt')

# Check for CUDA availability
if not torch.cuda.is_available():
    print("CUDA is not available.")
    device = model.device
    print(f"🔥 YOLO is running on: {device}")    
   

else:
    print("CUDA is available.")
    device = 'cuda'
    model.to(device)
    print(torch.cuda.get_device_properties(0))

    



# Class ID to name mapping
class_names = {0: 'Bus', 1: 'Car', 2: 'Jeep', 3: 'Motorcycle', 4: 'Person', 5: 'Tricycle', 6: 'Truck', 7: 'Van'}
allowed_classes = [0, 1, 2, 3, 4, 5, 6, 7]

# Assign a unique color to each class
class_colors = {
    0: (255, 0, 0),    # Red for Bus
    1: (0, 255, 0),    # Green for Car
    2: (0, 0, 255),    # Blue for Jeep
    3: (255, 255, 0),  # Cyan for Motorcycle
    4: (255, 0, 255),  # Magenta for Person
    5: (0, 255, 255),  # Yellow for Tricycle
    6: (255, 255, 255), #  for Truck
    7: (0, 0, 0),      #  for Van
} 

# Lane Configuration
bsu_road_distance = 12
PB_road_distance = 26

line_color = (0, 0, 255)  # Red line
line_color_2 = (255, 0, 0)  # Green line
line_thickness = 2

# Red and blue lines for BSU
bsu_red_line_y, bsu_blue_line_y = 180, 100
bsu_line_start_1, bsu_line_end_1 = (437, bsu_red_line_y), (570, bsu_red_line_y)
bsu_line_start_2, bsu_line_end_2 = (427, bsu_blue_line_y), (490, bsu_blue_line_y)

# Red and blue lines for PB
PB_red_line_y, PB_blue_line_y = 300, 215
PB_line_start_1, PB_line_end_1 = (0, PB_red_line_y), (1080, PB_red_line_y)
PB_line_start_2, PB_line_end_2 = (0, PB_blue_line_y), (1080, PB_blue_line_y)


PB_speed_calculator = SpeedCalculator(PB_red_line_y, PB_blue_line_y, PB_road_distance)
bsu_speed_calculator = SpeedCalculator(bsu_red_line_y, bsu_blue_line_y, bsu_road_distance)

# Define trapezoidal ROI coordinates
pb_roi = np.array([
    [61, 369],     # Bottom left
    [852, 349],    # Bottom right
    [429, 199],    # Top right
    [275, 197]     # Top left
])

tracker = Tracker()
DESIRED_FPS = 30

latest_speed_bsu = {}
latest_speed_PB = {}

# Store the different vehicle classifications
vehicle_classifications_PB = {class_id: 0 for class_id in allowed_classes}
vehicle_classifications_BSU = {class_id: 0 for class_id in allowed_classes}

# Counters for unique vehicles passing the blue line in each video feed
# Change these to lists to allow modification
unique_vehicle_count_PB = [0]
unique_vehicle_count_BSU = [0]

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY) # type: ignore

class VideoRequest(BaseModel):
    video_names: list[str]

# Store selected classes as a set for dynamic updates
selected_classes = set()

class ClassUpdateRequest(BaseModel):
    vehicle_classes: list[str]

def get_local_ip():
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip
    except socket.error as e:
        print(f"Error fetching local IP: {e}")
        return None

ip = '127.0.0.1'

@app.post("/update_classes")
async def update_classes(request: ClassUpdateRequest):
    global selected_classes
    valid_classes = set(request.vehicle_classes) & set(class_names.values())  # Filter valid class names

    if valid_classes:
        selected_classes = valid_classes  # Update the global set
        return {"message": f"Bounding boxes will be drawn for: {', '.join(selected_classes)}"}
    else:
        selected_classes = set(class_names.values())
        return {"error": "Invalid class names provided"}

def fetch_videos(video_names):
    """Fetch available videos from the database."""
    print(f"Fetching videos for: {video_names}")  # Debugging line

    response = supabase.table("video_data").select("video_name, video_source").in_("video_name", video_names).execute()
    
    if response.data:
        print(f"Fetched videos: {response.data}")  # Debugging line
        return response.data
    else:
        print("No videos found.")  # Debugging line
        return []

async def process_video(video_path, speed_calculator, latest_speed_store, websocket: WebSocket):
    """Process a video file or an IP camera stream."""
    global selected_classes

    is_ip_camera = video_path.startswith(("rtsp://", "http://", "https://")) 
    display_speed = 0
    while True:  # 🔥 Keep trying until we get a working stream
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            print(f"❌ Failed to open video source: {video_path}. Retrying in 3s...")
            await asyncio.sleep(3)  # Wait and retry
            continue  # Try again

        print(f"✅ Connected to {video_path}")

        prev_time = time.time()
        frame_interval = 1.0 / DESIRED_FPS


        # Set to keep track of vehicles that have already crossed the blue line
        crossed_vehicles = set()
        rounded_speeds = {}

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
                og_height, og_width = frame.shape[:2]
                resized_frame = cv2.resize(frame, (320, 320))

                results = model(resized_frame,verbose=False)
                fps = 1 / (time.time() - prev_time)

                class_id = -1

                if len(results) > 0 and len(results[0].boxes) > 0:
                    detections = results[0].boxes.xyxy.cpu().numpy()
                    scores = results[0].boxes.conf.cpu().numpy()
                    class_ids = results[0].boxes.cls.cpu().numpy()
                    valid_detections = [(detections[i], scores[i], class_ids[i]) for i in range(len(class_ids)) if class_ids[i] in allowed_classes]

                    rects = []
                    for bbox, score, class_id in valid_detections:
                        x1, y1, x2, y2 = bbox
                        x1, y1, x2, y2 = int(x1 * og_width / 320), int(y1 * og_height / 320), int(x2 * og_width / 320), int(y2 * og_height / 320)

                        # Check if the bounding box center lies inside the trapezoid
                        center_x = (x1 + x2) // 2
                        center_y = (y1 + y2) // 2
                        if cv2.pointPolygonTest(pb_roi, (center_x, center_y), False) >= 0:
                            x, y, w, h = x1, y1, x2 - x1, y2 - y1
                            rects.append([x, y, w, h])
                            
                            class_name = class_names.get(int(class_id), "Unknown")
                            if class_name in selected_classes:
                                # Use class-specific color for bounding box and text
                                color = class_colors.get(int(class_id), (0, 255, 0))  # Default to green if class_id not found
                                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                                label = f"{class_names.get(int(class_id), 'Unknown')} {score:.2f}"
                                cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
                        

                    objects_bbs_ids = tracker.update(rects)

                    for obj in objects_bbs_ids:
                        x, y, w, h, id = obj
                        cx, cy = (x + x + w) // 2, (y + y + h) // 2

                        speed, entry_time, exit_time = speed_calculator.calculate_speed(cx, cy, id, frame, [x, y, x + w, y + h])
                        if speed is not None:
                            rounded_speed = round(speed, 2)
                            latest_speed_store[id] = rounded_speed
                            display_speed = rounded_speed
                            # Check if the vehicle has already crossed the blue line
                            if class_id in allowed_classes:
                                if class_id not in crossed_vehicles:  # Only count the vehicle once
                                    vehicle_classifications_PB[class_id] += 1
                        else:
                            display_speed = latest_speed_store.get(id, 0)

                        


                class_name = class_names.get(int(class_id), "Unknown")
                cv2.putText(frame, f"{class_name} Speed: {display_speed:.2f} km/h", 
                            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                small_frame = cv2.resize(frame, (480, 320))
                _, encoded_image = cv2.imencode('.jpg', small_frame)

                await websocket.send_bytes(encoded_image.tobytes())

                # Stop if it's a local video file
                if not is_ip_camera and cap.get(cv2.CAP_PROP_POS_FRAMES) >= cap.get(cv2.CAP_PROP_FRAME_COUNT):
                    break

        finally:
            cap.release()
            print(f"🔄 Releasing video source: {video_path}. Restarting in 3s...")  # Debugging
            await asyncio.sleep(3) 

            
active_streams = {}
@app.websocket("/ws/videos/{video_name}")
async def websocket_stream(websocket: WebSocket, video_name: str):
    """Handles multiple video streams by running them asynchronously."""
    
    await websocket.accept()

    video_data = fetch_videos([video_name])
    if not video_data:
        await websocket.close()
        return

    video_path = video_data[0]["video_source"]

    if video_name == "bsu_road":
        speed_calc = bsu_speed_calculator
        latest_speed = latest_speed_bsu
    else:
        speed_calc = PB_speed_calculator
        latest_speed = latest_speed_PB

    # Prevent multiple restarts by checking if a task exists
    if video_name in active_streams:
        print(f"⚠️ Stream {video_name} is already active!")
        return

    # Run video processing in a new task (NON-BLOCKING)
    task = asyncio.create_task(process_video(video_path, speed_calc, latest_speed, websocket))
    
    # Keep track of active streams
    active_streams[video_name] = task

    try:
        await task
    except Exception as e:
        print(f"🔥 WebSocket error for {video_name}: {e}")
    finally:
        del active_streams[video_name]  # Clean up when WebSocket closes




@app.get("/PB_vehicle_classifications")
async def PB_vehicle_classifications():
    """Return vehicle classifications for PB video feed."""
    response_data = {
        "vehicle_classifications": {class_names[class_id]: count for class_id, count in vehicle_classifications_PB.items()}
    }
    return JSONResponse(content=response_data)


@app.get("/BSU_vehicle_classifications")
async def bsu_vehicle_classifications():
    """Return vehicle classifications for BSU video feed."""
    response_data = {
        "vehicle_classifications": {class_names[class_id]: count for class_id, count in vehicle_classifications_BSU.items()}
    }
    return JSONResponse(content=response_data)



@app.get("/PB_latest_speed")
async def PB_latest_speed():
    """Return latest speed data and crossed IDs for PB video feed."""
    response_data = {
        "latest_speed": latest_speed_PB,
        "vehicle_count": unique_vehicle_count_PB[0]
    }
    return JSONResponse(content=response_data)


@app.get("/bsu_latest_speed")
async def bsu_latest_speed():
    """Return latest speed data and crossed IDs for BSU video feed."""
    response_data = {
        "latest_speed": latest_speed_bsu,
        "vehicle_count": unique_vehicle_count_BSU[0]
    }
    return JSONResponse(content=response_data)
@app.get("/favicon.ico", include_in_schema=False)
async   def favicon():
    favicon_path = os.path.join("WebServer", "favicon.ico")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    # Fallback: Redirect or return a default response
    return RedirectResponse(url="https://fastapi.tiangolo.com/img/favicon.png")

def start_server() -> None:
    uvicorn.run("main:app", host="0.0.0.0", port=8000, timeout_keep_alive=30)


if __name__ == "__main__":
    # Run the server in a separate thread
    server_thread = threading.Thread(target=start_server)
    server_thread.start()