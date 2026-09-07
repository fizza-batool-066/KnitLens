from services.qwen_service import generate_crochet_feedback

result = generate_crochet_feedback(
    "Sunflower Coaster",
    {
        "classes": ["swatch", "hole"],
        "confidence": 95
    }
)

print(result)