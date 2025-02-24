
import yt_dlp

# YouTube Video URL
video_url = "https://www.youtube.com/watch?v=e_WBuBqS9h8"

# Get direct video stream URL using yt_dlp
ydl_opts = {
    "quiet": True,
    "format": "best[ext=mp4]",
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info_dict = ydl.extract_info(video_url, download=False)
    stream_url = info_dict["url"] 

print(stream_url)