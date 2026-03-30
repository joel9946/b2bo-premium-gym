import os
from PIL import Image

image_dir = r"c:\b2b0 website\src\assets\images"
images_to_use = [
    "rope_jump.jpg",
    "dane-wetton-t1NEMSm1rgI-unsplash.jpg",
    "rodrigo-rodrigues-wolf-r-t-78E-sY8mVsM-unsplash.jpg",
    "siamak-T7Xr3t_nA1w-unsplash.jpg",
    "corey-young-JRrlaZpd7F4-unsplash.jpg"
]

target_names = [
    "cardio-jump.webp",
    "personal-plank.webp",
    "crossfit-ropes.webp",
    "dumbbells-bg.webp",
    "weight-deadlift.webp"
]

for src, target in zip(images_to_use, target_names):
    src_path = os.path.join(image_dir, src)
    if os.path.exists(src_path):
        target_path = os.path.join(image_dir, target)
        img = Image.open(src_path)
        img.thumbnail((1200, 1200)) # Resize largest side to 1200 for web
        img.save(target_path, "WEBP", quality=80)
        print(f"Optimized {src} to {target} (Size: {os.path.getsize(target_path) // 1024} KB)")
