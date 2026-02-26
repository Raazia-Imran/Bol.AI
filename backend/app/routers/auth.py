from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
async def auth_status():
    """Placeholder for Supabase OAuth endpoints (Move 2)."""
    return {"message": "Auth router ready — Supabase OAuth coming in Move 2."}
