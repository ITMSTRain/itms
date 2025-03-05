import subprocess
import sys

def install_pytorch():
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", 
            "torch", "torchvision", "torchaudio",
            "--index-url", "https://download.pytorch.org/whl/cu126"
        ])
        print("\n✅ PyTorch installed successfully with CUDA 12.6!")
    except subprocess.CalledProcessError:
        print("\n❌ Error installing PyTorch. Check your internet connection and CUDA compatibility.")

def install_requirements():
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("\n✅ All dependencies installed successfully!")
    except subprocess.CalledProcessError:
        print("\n❌ Error installing dependencies. Check your `requirements.txt` file.")

if __name__ == "__main__":
    install_pytorch()  # 🛠 Install CUDA-compatible PyTorch first
    install_requirements()  # 📦 Then install all other dependencies
