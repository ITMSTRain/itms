import socket

def get_local_ip():
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip
    except socket.error as e:
        print(f"Error fetching local IP: {e}")
        return None

if __name__ == "__main__":
    local_ip = get_local_ip()
    if local_ip:
        print(f"My local IP address is: {local_ip}")
