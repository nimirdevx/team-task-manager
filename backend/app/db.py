import certifi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings


client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_db() -> None:
    global client, database
    client = AsyncIOMotorClient(settings.mongodb_url, tlsCAFile=certifi.where())
    database = client[settings.database_name]


async def close_db() -> None:
    global client
    if client:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    if database is None:
        raise RuntimeError("Database not initialized")
    return database
