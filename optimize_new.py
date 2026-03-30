import os
from PIL import Image

image_dir = r"c:\b2b0 website\src\assets\images"
images_to_use = [
    "jonathan-borba-R0y_bEUjiOM-unsplash.jpg",
    "ivana-cajina-rdZg6xmnpVM-unsplash.jpg"
]

target_names = [
    "rehab-bg.webp",
    "boxing-bg.webp"
]

for src, target in zip(images_to_use, target_names):
    src_path = os.path.join(image_dir, src)
    if os.path.exists(src_path):
        target_path = os.path.join(image_dir, target)
        img = Image.open(src_path)
        img.thumbnail((1200, 1200)) # Resize largest side to 1200 for web
        img.save(target_path, "WEBP", quality=80)
        print(f"Optimized {src} to {target} (Size: {os.path.getsize(target_path) // 1024} KB)")
