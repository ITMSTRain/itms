import cv2
import numpy as np
from ultralytics import YOLO

# Load the YOLO model
model = YOLO('94%.pt')

# Load the video
video_path = r'video_samples\3.mp4'
cap = cv2.VideoCapture(video_path)

# Define trapezoidal ROI coordinates
trapezoid = np.array([
    [61, 369],     # Bottom left
    [852, 349],    # Bottom right
    [429, 199],    # Top right
    [275, 197]     # Top left
])


while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Perform YOLO detection on the current frame
    results = model(frame)

    # Filter detections inside the trapezoid ROI
    filtered_boxes = []
    for box in results[0].boxes.xyxy:
        x_min, y_min, x_max, y_max = box.tolist()
        center_x = (x_min + x_max) / 2
        center_y = (y_min + y_max) / 2

        # Check if the center of the bounding box is inside the trapezoid
        if cv2.pointPolygonTest(trapezoid, (center_x, center_y), False) >= 0:
            filtered_boxes.append(box)


    # Draw filtered detections
    for box in filtered_boxes:
        x_min, y_min, x_max, y_max = map(int, box)
        cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (255, 0, 0), 2)

    # Display the result
    cv2.imshow('Filtered Detections', frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
