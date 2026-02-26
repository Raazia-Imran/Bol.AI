from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import gemini, auth

app = FastAPI(
    title="Bol.AI Backend",
    description="Real-time English fluency coaching API powered by Gemini Live.",
    version="0.1.0",
)

# Allow Expo dev client & production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(gemini.router, prefix="/gemini", tags=["Gemini"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Bol.AI Backend"}
