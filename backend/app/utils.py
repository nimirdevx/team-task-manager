from datetime import datetime

from bson import ObjectId


def serialize_document(document: dict) -> dict:
    result = {}
    for key, value in document.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, list):
            result[key] = [str(item) if isinstance(item, ObjectId) else item for item in value]
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        else:
            result[key] = value
    if "_id" in result:
        result["id"] = result.pop("_id")
    return result


def serialize_public_user(document: dict) -> dict:
    data = serialize_document(document)
    data.pop("hashed_password", None)
    return data
