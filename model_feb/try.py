import cv2

# Open the video file
cap = cv2.VideoCapture(r'C:\importanteng itlog\Coding Files\Vision_Drive\itms\model_feb\video_samples\2.mp4')

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Display the frame
    cv2.imshow('Video Player', frame)

    # Press 'q' to exit the video player
    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

# Release the video capture object and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()