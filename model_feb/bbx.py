import cv2
from ultralytics import YOLO
import numpy as np

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
    6: (255, 255, 255), # White for Truck
    7: (0, 0, 0),      # Black for Van
}

# Load YOLO model
model = YOLO('94%.pt')

# Video path
video_path = 'video_samples/1.mp4'  # Change filename as needed

# Open video
cap = cv2.VideoCapture(video_path)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    og_height, og_width = frame.shape[:2]
    resized_frame = cv2.resize(frame, (320, 320))
    # Inference
    results = model(resized_frame, verbose=False)

    # Draw custom bounding boxes and labels
    if len(results) > 0 and len(results[0].boxes) > 0:
        detections = results[0].boxes.xyxy.cpu().numpy()
        scores = results[0].boxes.conf.cpu().numpy()
        class_ids = results[0].boxes.cls.cpu().numpy()
        for i in range(len(class_ids)):
            class_id = int(class_ids[i])
            if class_id in allowed_classes:
                x1, y1, x2, y2 = detections[i]
                # Scale boxes back to original frame size
                x1 = int(x1 * og_width / 320)
                y1 = int(y1 * og_height / 320)
                x2 = int(x2 * og_width / 320)
                y2 = int(y2 * og_height / 320)
                color = class_colors.get(class_id, (0, 255, 0))
                label = f"{class_names[class_id]} {scores[i]:.2f}"
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    small_frame = cv2.resize(frame, (480, 320))
    # Display
    cv2.imshow('YOLO Detection', small_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()