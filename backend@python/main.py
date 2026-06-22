import io
import os
from typing import List
from typing_extensions import Annotated  # Use standard typing if on Python 3.9+

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import google.generativeai as genai
from PIL import Image

# Load environment variables
load_dotenv()

# Gemini configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Grain analyzer running"}


@app.post("/analyze-grain")
@app.post("/analyze-grain")
async def analyze_grain(

    crop_name: str = Form(...),

    variety: str = Form(...),

    location: str = Form(...),

    images: List[UploadFile] = File(...)

):

    uploaded_images = []

    gemini_image_payload = []


    for image in images:

        image_bytes = await image.read()

        img = Image.open(
            io.BytesIO(image_bytes)
        )


        gemini_image_payload.append(img)


    
    prompt = f"""
You are a grain quality inspector.
Analyze the provided images of harvested grains.

Farmer details:
Crop: {crop_name}
Variety: {variety}

Give a simple market quality assessment.
Return ONLY valid JSON matching this schema exactly. Do not wrap it in markdown code blocks like ```json:
{{
  "quality_grade": "",
  "quality_score": "",
  "issues": [],
  "buyer_note": ""
}}

Judge only visible things:
- cleanliness
- grain uniformity
- broken grains
- discoloration
- damage
- visible fungal/insect signs

Do not estimate invisible properties.
"""

    # Combine the text prompt and the list of formatted images
    contents = [prompt] + gemini_image_payload

    # Send data to Gemini
    response = model.generate_content(contents)

    # Return the clean final structured JSON response
    return JSONResponse(
        content={
            "listing": {
                "crop_name": crop_name,
                "variety": variety,
                "location": location,
                "images_uploaded": len(images),
                "ai_quality": response.text,
            }
        }
    )