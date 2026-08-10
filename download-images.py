import re
import os
import requests

PROJECT_DIR = r"C:\Users\Raj\Desktop\anchhi app base44\3rd fixed base44"
OUTPUT_DIR = os.path.join(PROJECT_DIR, "downloaded_images")

os.makedirs(OUTPUT_DIR, exist_ok=True)

urls = set()

for root, dirs, files in os.walk(PROJECT_DIR):

    # Don't scan downloaded images
    if os.path.abspath(root) == os.path.abspath(OUTPUT_DIR):
        continue

    for filename in files:
        filepath = os.path.join(root, filename)

        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except:
            continue

        matches = re.findall(
            r'https://media\.db\.com/images/public/[^\s"\'<>]+',
            content
        )

        for url in matches:
            # Base44 changed the media domain
            url = url.replace(
                "https://media.db.com",
                "https://media.base44.com"
            )

            urls.add(url)

print(f"\nFound {len(urls)} image URLs.\n")

for url in urls:

    filename = url.split("/")[-1]
    filename = filename.split("?")[0]

    output = os.path.join(OUTPUT_DIR, filename)

    print(f"Downloading: {filename}")

    try:

        response = requests.get(
            url,
            timeout=30,
            headers={
                "User-Agent": "Mozilla/5.0"
            }
        )

        response.raise_for_status()

        with open(output, "wb") as f:
            f.write(response.content)

        print("  ✓ Saved")

    except Exception as e:
        print(f"  ✗ FAILED: {e}")

print("\nFinished.")
print(f"Images saved to:\n{OUTPUT_DIR}")