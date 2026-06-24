import io
import json
import os
import re
from typing import List
from urllib.request import urlopen

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()


class AnalyzeCropRequest(BaseModel):
    crop: str
    images: List[str]
    location: str = ""


@app.get("/")
def home():
    return {"message": "Grain analyzer running"}


def _download_image(url: str) -> Image.Image:
    with urlopen(url, timeout=30) as resp:
        return Image.open(io.BytesIO(resp.read()))


def _parse_gemini_json(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return json.loads(match.group())
    return {"quality_grade": "N/A", "quality_score": 0, "issues": [], "buyer_note": "Could not parse AI output"}


ANALYSIS_PROMPT = """
You are a grain quality inspector.
Analyze the provided images of harvested grains.

Farmer details:
Crop: {crop_name}

Give a simple market quality assessment.
Return ONLY valid JSON matching this schema exactly:
{{
  "quality_grade": "",
  "quality_score": 0,
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


@app.post("/analyze-crop")
async def analyze_crop(req: AnalyzeCropRequest):
    gemini_images = []
    for url in req.images:
        try:
            gemini_images.append(_download_image(url))
        except Exception:
            pass

    if not gemini_images:
        return JSONResponse(
            content={
                "qualityGrade": "N/A",
                "qualityScore": 0,
                "issues": ["Could not download any images"],
                "buyerNote": "Failed to load images for analysis",
            }
        )

    prompt = ANALYSIS_PROMPT.format(crop_name=req.crop)
    contents = [prompt] + gemini_images
    response = model.generate_content(contents)

    try:
        parsed = _parse_gemini_json(response.text)
    except Exception:
        parsed = {"quality_grade": "N/A", "quality_score": 0, "issues": [], "buyer_note": "AI parse error"}

    return JSONResponse(content={
        "qualityGrade": parsed.get("quality_grade", "N/A"),
        "qualityScore": parsed.get("quality_score", 0),
        "issues": parsed.get("issues", []),
        "buyerNote": parsed.get("buyer_note", ""),
    })
