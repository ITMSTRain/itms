// Function to send the video path to FastAPI
async function sendVideoPath(videoId, videoPath) {
    const response = await fetch(`http://127.0.0.1:8000/set_video/${videoId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ video_path: videoPath })
    });
    const data = await response.json();
    console.log(data);
}

// Function to start streaming the video
function startVideoStream(videoId) {
    const videoElement = document.getElementById("video-stream");
    videoElement.src = `http://127.0.0.1:8000/video_feed/${videoId}`;
}

// Example usage
const videoId = "test_video";
const videoPath = "/path/to/video.mp4";

function handleVideoRequest() {
    const videoPath = document.getElementById("videoPath").value;
    if (!videoPath) {
        alert("Please enter a valid video path.");
        return;
    }

    const videoId = "user_video"; // You can generate a unique ID dynamically
    sendVideoPath(videoId, videoPath).then(() => {
        startVideoStream(videoId);
    });
}
