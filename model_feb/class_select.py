from ultralytics import YOLO
import cv2
import matplotlib.pyplot as plt
import time

# Load the YOLO model (adjust the model path as needed)
model = YOLO("94%.pt")

# Define candidate vehicle classes to cycle through.
# Adjust the list based on your model's classes. Ensure these exist in model.names.
candidate_vehicle_classes = ["car", "bus", "truck", "motorcycle"]

# Set an initial vehicle class (the "other vehicle class")
current_vehicle_class = candidate_vehicle_classes[0]

# Get the class ids for the current vehicle class from the model
def get_class_ids(vehicle_class: str):
    return [cid for cid, name in model.names.items() if name.lower() == vehicle_class.lower()] # type: ignore

current_class_ids = get_class_ids(current_vehicle_class)
if not current_class_ids:
    print(f"Warning: No class IDs found for '{current_vehicle_class}' in the model.")

# Toggle flags
# show_other: if False, skip drawing detections of the current vehicle class.
# record_other: if True, record and plot detection counts.
show_other = True
record_other = False

# Data for recording counts
timestamps = []
detection_counts = []
record_start_time = time.time()

# Prepare matplotlib for interactive plotting
plt.ion()
fig, ax = plt.subplots()
line, = ax.plot([], [], marker='o')
ax.set_xlabel("Time (s)")
ax.set_ylabel("Detection Count")
ax.set_title(f"Detections for '{current_vehicle_class}' Over Time")

def update_chart():
    """Update the live chart with recorded detection counts."""
    line.set_data(timestamps, detection_counts)
    ax.relim()
    ax.autoscale_view()
    fig.canvas.draw()
    fig.canvas.flush_events()

def reset_chart():
    """Reset the chart and data when changing vehicle class."""
    global timestamps, detection_counts, record_start_time, fig, ax, line
    timestamps = []
    detection_counts = []
    record_start_time = time.time()
    plt.close(fig)
    plt.ion()
    fig, ax = plt.subplots()
    line, = ax.plot([], [], marker='o')
    ax.set_xlabel("Time (s)")
    ax.set_ylabel("Detection Count")
    ax.set_title(f"Detections for '{current_vehicle_class}' Over Time")

def resize_frame(frame, width=640):
    aspect_ratio = frame.shape[1] / frame.shape[0]
    new_height = int(width / aspect_ratio)
    return cv2.resize(frame, (width, new_height))

def detect_and_control():
    global show_other, record_other, current_vehicle_class, current_class_ids
    video_path = r"video_samples\1.mp4"  # Change to 0 for webcam if needed
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video source {video_path}")
        return
    else:
        print("Video stream opened successfully.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("No more frames or error reading frame.")
            break

        # Resize frame for faster inference
        frame = resize_frame(frame, width=640)

        # Run inference
        results = model.predict(frame, save=False, show=False)
        annotated_frame = frame.copy()

        # Count detections for the current vehicle class
        count = 0
        boxes = results[0].boxes
        if boxes is not None:
            for box in boxes.data:
                x1, y1, x2, y2, conf, cls = box.tolist()
                cls = int(cls)
                # Check if this detection belongs to the current vehicle class
                if cls in current_class_ids:
                    count += 1
                    # Only draw if toggled on
                    if show_other:
                        cv2.rectangle(annotated_frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                        label = model.names.get(cls, str(cls)) # type: ignore
                        cv2.putText(annotated_frame, f"{label}: {conf:.2f}", (int(x1), int(y1) - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                else:
                    # Draw boxes for other detections normally
                    cv2.rectangle(annotated_frame, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0), 2)
                    label = model.names.get(cls, str(cls)) # type: ignore
                    cv2.putText(annotated_frame, f"{label}: {conf:.2f}", (int(x1), int(y1) - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

        # If recording is toggled on, record detection count over time
        if record_other:
            current_time = time.time() - record_start_time
            timestamps.append(current_time)
            detection_counts.append(count)
            update_chart()

        # Display current status on frame
        status_text = f"Vehicle: {current_vehicle_class} | Render: {show_other} | Record: {record_other} | Count: {count}"
        cv2.putText(annotated_frame, status_text, (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        cv2.imshow("Vehicle Detection Control", annotated_frame)
        key = cv2.waitKey(1) & 0xFF

        # Toggle rendering of the current vehicle class detections
        if key == ord('e'):
            show_other = not show_other
            print(f"Toggled render for '{current_vehicle_class}': {show_other}")

        # Toggle recording of detection counts (and show/hide chart)
        if key == ord('r'):
            record_other = not record_other
            if record_other:
                print(f"Started recording detections for '{current_vehicle_class}'.")
            else:
                print("Stopped recording and closing chart.")
                plt.close(fig)

        # Change the current vehicle class (cycle through candidate list)
        if key == ord('c'):
            current_index = candidate_vehicle_classes.index(current_vehicle_class)
            # Cycle to next candidate (wrap around)
            current_vehicle_class = candidate_vehicle_classes[(current_index + 1) % len(candidate_vehicle_classes)]
            current_class_ids = get_class_ids(current_vehicle_class)
            print(f"Changed vehicle class to: {current_vehicle_class}")
            # Reset recording data and update chart title
            reset_chart()

        if key == ord('q'):
            print("Exiting detection loop.")
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Released video stream and closed windows.")

# Run the detection with control functions
detect_and_control()
