from flask import Flask, request, jsonify
from PIL import Image
import google.generativeai as genai
from io import BytesIO
import requests
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # 👈 This enables CORS for all routes


# ==== Gemini Setup ====
API_KEY = "AIzaSyD_w7r0TWHvgj7fAhPRtwdZnNhQPrLsGd4"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/caption", methods=["POST"])
def caption_image():
    try:
        data = request.json
        image_url = data.get("url")

        if not image_url:
            return jsonify({"error": "No URL provided"}), 400

        print(f"🔗 Fetching image from: {image_url}")
        img_response = requests.get(image_url)
        img_response.raise_for_status()
        image = Image.open(BytesIO(img_response.content))

        print("🧠 Sending image to Gemini...")
        prompt = "Describe this image in rich detail for someone who is blind. Include setting, colors, emotions, layout, and subtle cues. Keep the wordings under 50words"
        gemini_response = model.generate_content([prompt, image])

        print("✅ Caption received.")
        return jsonify({"caption": gemini_response.text})

    except Exception as e:
        print("❌ Error in caption_image:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
