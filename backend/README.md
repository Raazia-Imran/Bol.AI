# Bol.AI Backend

FastAPI backend for the Bol.AI English fluency coaching app.

## Setup

```bash
# Create & activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Copy env template
copy .env.example .env       # Windows
cp .env.example .env         # macOS/Linux
# Fill in your GOOGLE_API_KEY and Supabase credentials

# Run dev server
uvicorn main:app --reload
```

## Project Structure

```
backend/
├── main.py                  # FastAPI app entry point
├── requirements.txt
├── .env.example
└── app/
    ├── routers/
    │   ├── auth.py          # Supabase OAuth endpoints (Move 2)
    │   └── gemini.py        # Gemini Live API WebSocket (Move 3)
    └── services/
        └── gemini_service.py  # Core AI session logic (Move 3)
```
