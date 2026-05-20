from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY', '')
OWM_BASE = "https://api.openweathermap.org"

app = FastAPI()
api_router = APIRouter(prefix="/api")


class FavoriteCity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    city_name: str
    lat: float
    lon: float
    country: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FavoriteCityCreate(BaseModel):
    city_name: str
    lat: float
    lon: float
    country: str = ""


def check_api_key():
    if not OPENWEATHER_API_KEY:
        raise HTTPException(503, "Weather API key not configured. Add OPENWEATHER_API_KEY to backend .env")


@api_router.get("/weather/current")
async def get_current_weather(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    city: Optional[str] = None
):
    check_api_key()
    async with httpx.AsyncClient() as http:
        if city:
            geo_res = await http.get(
                f"{OWM_BASE}/geo/1.0/direct",
                params={"q": city, "limit": 1, "appid": OPENWEATHER_API_KEY},
                timeout=10
            )
            geo_data = geo_res.json()
            if not geo_data:
                raise HTTPException(404, "City not found")
            lat = geo_data[0]["lat"]
            lon = geo_data[0]["lon"]

        if lat is None or lon is None:
            raise HTTPException(400, "Provide lat/lon or city name")

        res = await http.get(
            f"{OWM_BASE}/data/2.5/weather",
            params={"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"},
            timeout=10
        )
        if res.status_code != 200:
            raise HTTPException(res.status_code, f"Weather API error: {res.text}")
        return res.json()


@api_router.get("/weather/forecast")
async def get_forecast(lat: float, lon: float):
    check_api_key()
    async with httpx.AsyncClient() as http:
        res = await http.get(
            f"{OWM_BASE}/data/2.5/forecast",
            params={"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"},
            timeout=10
        )
        if res.status_code != 200:
            raise HTTPException(res.status_code, f"Forecast API error: {res.text}")
        return res.json()


@api_router.get("/weather/air-quality")
async def get_air_quality(lat: float, lon: float):
    check_api_key()
    async with httpx.AsyncClient() as http:
        res = await http.get(
            f"{OWM_BASE}/data/2.5/air_pollution",
            params={"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY},
            timeout=10
        )
        if res.status_code != 200:
            raise HTTPException(res.status_code, f"Air quality API error: {res.text}")
        return res.json()


@api_router.get("/weather/geocode")
async def geocode_city(q: str):
    check_api_key()
    async with httpx.AsyncClient() as http:
        res = await http.get(
            f"{OWM_BASE}/geo/1.0/direct",
            params={"q": q, "limit": 5, "appid": OPENWEATHER_API_KEY},
            timeout=10
        )
        if res.status_code != 200:
            raise HTTPException(res.status_code, f"Geocode API error: {res.text}")
        return res.json()


@api_router.get("/favorites", response_model=List[FavoriteCity])
async def get_favorites():
    favs = await db.favorites.find({}, {"_id": 0}).to_list(100)
    return favs


@api_router.post("/favorites", response_model=FavoriteCity)
async def add_favorite(data: FavoriteCityCreate):
    existing = await db.favorites.find_one({"city_name": data.city_name}, {"_id": 0})
    if existing:
        return existing

    fav = FavoriteCity(**data.model_dump())
    doc = fav.model_dump()
    await db.favorites.insert_one(doc)
    return fav


@api_router.delete("/favorites/{fav_id}")
async def delete_favorite(fav_id: str):
    result = await db.favorites.delete_one({"id": fav_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Favorite not found")
    return {"status": "deleted"}


@api_router.get("/")
async def root():
    return {"message": "Weather API running", "api_key_configured": bool(OPENWEATHER_API_KEY)}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
