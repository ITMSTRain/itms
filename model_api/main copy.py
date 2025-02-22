import cv2
from ultralytics import YOLO
import torch
import sys
import time
import asyncio
from speed_calculator import SpeedCalculator

from tracker import Tracker

from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware

import uvicorn
import webbrowser
import threading
import os


app = FastAPI()

app.mount("/WebServer", StaticFiles(directory="WebServer"), name="WebServer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins like ["http://localhost"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the YOLO model
model = YOLO('93%.pt')

# Check for CUDA availability
if not torch.cuda.is_available():
    print(torch.cuda.get_device_properties)
    sys.exit(1)

device = 'cuda'
model.to(device)

# Class ID to name mapping
class_names = {0: 'Bus', 1: 'Car', 2: 'Jeep', 3: 'Motorcycle', 4: 'Tricycle', 5: 'Truck'}
allowed_classes = [1, 2, 3, 5, 7]

# CSV logger
# csv_logger = CSVLogger('yolo_performance_logs.csv', 'yolo_detection_logs.csv', 'yolo_speed_logs.csv')

# Lane Configuration
bsu_road_distance = 5
PB_road_distance = 12

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

# Speed calculators
offset = 23
PB_speed_calculator = SpeedCalculator(PB_red_line_y, PB_blue_line_y, offset, PB_road_distance)
bsu_speed_calculator = SpeedCalculator(bsu_red_line_y, bsu_blue_line_y, offset, bsu_road_distance)

tracker = Tracker()
DESIRED_FPS = 25

# Store the latest speed values
latest_speed_bsu = {}
latest_speed_PB = {}

# Counters for unique vehicles passing the blue line in each video feed
# Change these to lists to allow modification
unique_vehicle_count_PB = [0]
unique_vehicle_count_BSU = [0]




async def process_video(video_path, line_start_1, line_end_1, line_start_2, line_end_2, speed_calculator, latest_speed_store, unique_vehicle_counter):
    cap = cv2.VideoCapture(video_path)
    prev_time = time.time()
    frame_interval = 1.0 / DESIRED_FPS
    frame_count = 0

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

            # Draw red and blue lines
            cv2.line(frame, line_start_1, line_end_1, line_color, line_thickness)
            cv2.line(frame, line_start_2, line_end_2, line_color_2, line_thickness)

            results = model(resized_frame)
            fps = 1 / (time.time() - prev_time)

            if len(results) > 0 and len(results[0].boxes) > 0:
                detections = results[0].boxes.xyxy.cpu().numpy()
                scores = results[0].boxes.conf.cpu().numpy()
                class_ids = results[0].boxes.cls.cpu().numpy()
                valid_detections = [(detections[i], scores[i], class_ids[i]) for i in range(len(class_ids)) if class_ids[i] in allowed_classes]

                rects = []
                for bbox, score, class_id in valid_detections:
                    x1, y1, x2, y2 = bbox
                    x1, y1, x2, y2 = int(x1 * og_width / 320), int(y1 * og_height / 320), int(x2 * og_width / 320), int(y2 * og_height / 320)
                    x, y, w, h = x1, y1, x2 - x1, y2 - y1
                    rects.append([x, y, w, h])

                objects_bbs_ids = tracker.update(rects)

                for obj in objects_bbs_ids:
                    x, y, w, h, id = obj
                    cx, cy = (x + x + w) // 2, (y + y + h) // 2


                    # Speed calculation and logging (if needed)
                    bbox = [x, y, x + w, y + h]
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 1)
                    cv2.putText(frame, f"ID: {id}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)


                    speed, entry_time, exit_time = speed_calculator.calculate_speed(cx, cy, id, frame, bbox)
                    if speed is not None and entry_time is not None and exit_time is not None:
                        unique_vehicle_counter[0] += 1
                        latest_speed_store[id] = round(speed, 2)
                        

            cv2.putText(frame, f"FPS: {fps:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 1)
            small_frame = cv2.resize(frame, (480, 320))
            _, encoded_image = cv2.imencode('.jpg', small_frame)

            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + encoded_image.tobytes() + b'\r\n')

    finally:
        cap.release()



@app.get("/PB_video_feed")
def PB_video_feed():
    global unique_vehicle_count_PB
    return StreamingResponse(process_video(
        r'video_samples\3.mp4',
        PB_line_start_1, PB_line_end_1, PB_line_start_2, PB_line_end_2,
        PB_speed_calculator, latest_speed_PB, unique_vehicle_count_PB
    ), media_type="multipart/x-mixed-replace; boundary=frame")



@app.get("/bsu_video_feed")
def bsu_video_feed():
    global unique_vehicle_count_BSU
    return StreamingResponse(process_video(
        r'video_samples\1.mp4',
        bsu_line_start_1, bsu_line_end_1, bsu_line_start_2, bsu_line_end_2,
        bsu_speed_calculator, latest_speed_bsu, unique_vehicle_count_BSU
    ), media_type="multipart/x-mixed-replace; boundary=frame")



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

@app.get("/")
async def read_root():
    with open(r"WebServer\index.html", "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)

# Serve the favicon.ico directly from the root
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse(os.path.join("WebServer", "favicon.ico"))

def start_server():
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

def open_browser():
    time.sleep(1)  # Give the server a moment to start
    webbrowser.open("http://127.0.0.1:8000")

if __name__ == "__main__":
    # Run the server in a separate thread
    server_thread = threading.Thread(target=start_server)
    server_thread.start()

    # Open the browser
    open_browser()