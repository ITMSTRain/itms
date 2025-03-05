from ultralytics import YOLO

model = YOLO(r'..\model_feb\94%.pt')

results = model(source="video_samples/1.mp4", show=True, conf=0.3)