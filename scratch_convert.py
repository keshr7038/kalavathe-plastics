import os
from PIL import Image

def convert_png_to_webp(src_path, dest_path):
    try:
        im = Image.open(src_path)
        im.save(dest_path, "webp")
        print(f"Successfully converted {src_path} to {dest_path}")
    except Exception as e:
        print(f"Error converting {src_path}: {e}")

if __name__ == "__main__":
    # Test script
    print("Python script runs successfully!")
