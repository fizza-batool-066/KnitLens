from pathlib import Path

import cv2
from ultralytics import YOLO

from config import BASE_DIR, UPLOAD_DIR, YOLO_MODEL_PATH
from utils.files import unique_filename

_model = None


def resolve_model_path() -> Path:
    candidates = [
        Path(YOLO_MODEL_PATH),
        BASE_DIR / YOLO_MODEL_PATH,
        BASE_DIR / "models" / "best.pt",
        BASE_DIR.parent / "best.pt",
    ]
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    raise FileNotFoundError(
        "YOLOv11 weights were not found. Place best.pt at backend/models/best.pt"
    )


def get_model() -> YOLO:
    global _model
    if _model is None:
        _model = YOLO(str(resolve_model_path()))
    return _model


def detect_crochet(image_path: str | Path) -> dict:
    try:
        model = get_model()
        results = model.predict(
            source=str(image_path),
            conf=0.25,
            verbose=False,
        )
    except FileNotFoundError as error:
        raise RuntimeError(str(error)) from error
    except Exception as error:
        raise RuntimeError(f"YOLO detection failed: {error}") from error

    if not results:
        raise RuntimeError("YOLO returned no results for this image")

    result = results[0]
    names = result.names or {}
    detections = []
    boxes_payload = []

    if result.boxes is not None:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            label = names.get(class_id, str(class_id))
            xyxy = [float(value) for value in box.xyxy[0].tolist()]
            detections.append(
                {
                    "class": label,
                    "confidence": round(confidence * 100, 2),
                    "box": xyxy,
                }
            )
            boxes_payload.append(
                {
                    "label": label,
                    "confidence": round(confidence * 100, 2),
                    "xyxy": xyxy,
                }
            )

    classes = [item["class"] for item in detections]
    unique_classes = sorted(set(classes))
    avg_confidence = (
        round(sum(item["confidence"] for item in detections) / len(detections), 2)
        if detections
        else 0
    )

    annotated_filename = f"annotated_{unique_filename('frame.jpg')}"
    annotated_path = UPLOAD_DIR / annotated_filename
    plotted = result.plot()
    saved = cv2.imwrite(str(annotated_path), plotted)
    if not saved:
        raise RuntimeError("Could not save the annotated detection image")

    return {
        "classes": unique_classes,
        "all_classes": classes,
        "detections": detections,
        "boxes": boxes_payload,
        "confidence": avg_confidence,
        "count": len(detections),
        "annotated_filename": annotated_filename,
        "hole_count": classes.count("hole"),
        "swatch_count": classes.count("swatch"),
    }
