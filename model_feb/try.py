import socket
import os

def get_local_ip():
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip
    except socket.error as e:
        print(f"Error fetching local IP: {e}")
        return None

ip = get_local_ip()

print(ip)