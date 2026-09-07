import json
import os
import re

from openai import OpenAI

from config import QWEN_API_KEY, QWEN_BASE_URL, QWEN_MODEL

_client = None


def is_configured() -> bool:
    return bool(QWEN_API_KEY and QWEN_BASE_URL)


def get_client() -> OpenAI:
    global _client
    if _client is None:
        if not is_configured():
            raise RuntimeError("Qwen is not configured. Set QWEN_API_KEY and QWEN_BASE_URL")
        _client = OpenAI(api_key=QWEN_API_KEY, base_url=QWEN_BASE_URL)
    return _client


def _parse_json(text: str) -> dict:
    cleaned = (text or "").strip()
    if not cleaned:
        raise ValueError("Qwen returned an empty response")
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(0)

    try:
        payload = json.loads(cleaned)
    except json.JSONDecodeError as error:
        raise ValueError(f"Could not parse JSON from Qwen: {error}") from error

    if not isinstance(payload, dict):
        raise ValueError("Qwen response was not a JSON object")
    return payload


def _chat(system_prompt: str, user_prompt: str) -> str:
    client = get_client()
    model_name = os.getenv("QWEN_MODEL", QWEN_MODEL) or QWEN_MODEL
    kwargs = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.4,
    }
    try:
        response = client.chat.completions.create(
            **kwargs,
            response_format={"type": "json_object"},
        )
    except Exception:
        response = client.chat.completions.create(**kwargs)

    content = response.choices[0].message.content if response.choices else ""
    if not content:
        raise RuntimeError("Qwen returned an empty response")
    return content


def _fallback_feedback(project_name: str, yolo_result: dict) -> dict:
    detections = yolo_result.get("detections", [])
    classes = yolo_result.get("classes", [])
    confidence = yolo_result.get("confidence", 0)

    has_swatch = "swatch" in classes
    has_holes = "hole" in classes
    hole_count = classes.count("hole")

    if not detections:
        return {
            "progress_percent": 0,
            "health_score": 50,
            "explanation": "No crochet elements detected in this image. Please ensure good lighting and focus.",
            "mistake_analysis": "Unable to analyze - no clear crochet fabric detected",
            "suggested_fix": "Retake the photo with better lighting and closer focus on your work",
            "next_step": "Capture a clearer photo of your crochet project",
            "motivational_message": "Keep practicing! A good photo helps us give better feedback.",
        }

    progress = min(100, len(detections) * 10 + (50 if has_swatch else 0))
    health = max(0, 100 - (hole_count * 15))

    if has_holes:
        mistake = f"Detected {hole_count} potential gap(s) or missed stitch(es)"
        fix = "Check for dropped stitches and fill in any gaps"
    else:
        mistake = "No obvious mistakes detected"
        fix = "Continue with your current pattern"

    return {
        "progress_percent": progress,
        "health_score": health,
        "explanation": f"Detected {len(detections)} elements in your {project_name} with {confidence:.1f}% confidence.",
        "mistake_analysis": mistake,
        "suggested_fix": fix,
        "next_step": "Continue crocheting and check your stitch consistency",
        "motivational_message": "Great work! Your crochet is coming along nicely.",
    }


def generate_crochet_feedback(project_name: str, yolo_result: dict) -> dict:
    if not is_configured():
        return _fallback_feedback(project_name, yolo_result)

    prompt = f"""
You are KnitLens AI, an expert crochet instructor for beginners.

Project name: {project_name}

YOLO detection JSON:
{json.dumps(yolo_result, default=str)}

The detector only knows these classes: swatch (crochet fabric) and hole (gap, missed stitch, or opening).

Return ONLY valid JSON with these keys:
- progress_percent: integer 0-100 estimating how complete the visible work looks
- health_score: integer 0-100 for stitch quality (lower if holes/mistakes are present)
- explanation: short friendly summary of what you see
- mistake_analysis: what might be wrong based on detections (or say none found)
- suggested_fix: practical correction
- next_step: the next crochet action to take
- motivational_message: warm encouraging sentence

Never invent YOLO classes that were not detected. If nothing was detected, be honest and guide the user to retake a clearer photo.
"""

    try:
        raw = _chat(
            "You are a professional crochet instructor. Always reply with compact JSON.",
            prompt,
        )
        data = _parse_json(raw)

        required = [
            "progress_percent",
            "health_score",
            "explanation",
            "mistake_analysis",
            "suggested_fix",
            "next_step",
            "motivational_message",
        ]
        missing = [key for key in required if key not in data]
        if missing:
            raise RuntimeError(f"Qwen response missing fields: {', '.join(missing)}")

        data["progress_percent"] = max(0, min(100, int(float(data["progress_percent"]))))
        data["health_score"] = max(0, min(100, int(float(data["health_score"]))))
        for key in required:
            if isinstance(data.get(key), (int, float)):
                continue
            data[key] = str(data.get(key, ""))
        return data
    except Exception as error:
        print(f"Qwen API error, using fallback: {error}")
        return _fallback_feedback(project_name, yolo_result)


def _fallback_pattern(description: str, difficulty: str) -> dict:
    return {
        "title": f"Simple {difficulty} Crochet Project",
        "difficulty": difficulty,
        "estimated_time": "1-2 hours",
        "materials": [
            "Worsted weight yarn (any color)",
            "Crochet hook (size H/5mm or appropriate for yarn)",
            "Scissors",
            "Tapestry needle"
        ],
        "steps": [
            "Make a slip knot and chain 20 stitches",
            "Single crochet in the second chain from hook and across",
            "Chain 1, turn, single crochet across (repeat for desired length)",
            "Fasten off and weave in ends"
        ],
        "tips": [
            "Keep your tension consistent",
            "Count your stitches regularly",
            "Practice makes perfect!"
        ]
    }


def generate_pattern(description: str, difficulty: str) -> dict:
    if not is_configured():
        return _fallback_pattern(description, difficulty)

    prompt = f"""
Create a beginner-friendly crochet pattern.

Difficulty: {difficulty}
User request:
{description}

Return ONLY valid JSON with:
- title
- difficulty
- estimated_time
- materials: array of strings
- steps: array of short step strings
- tips: array of short tips
"""
    try:
        raw = _chat(
            "You are KnitLens AI. Reply with JSON only for crochet patterns.",
            prompt,
        )
        return _parse_json(raw)
    except Exception as error:
        print(f"Qwen API error, using fallback pattern: {error}")
        return _fallback_pattern(description, difficulty)
