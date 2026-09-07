from datetime import datetime


def stringify_id(document: dict | None) -> dict | None:
    if not document:
        return None
    item = dict(document)
    if "_id" in item:
        item["id"] = str(item.pop("_id"))
    for key, value in list(item.items()):
        if isinstance(value, datetime):
            item[key] = value.isoformat()
    item.pop("password", None)
    return item


def serialize_user(document: dict | None) -> dict | None:
    return stringify_id(document)
