import os
import asyncio
from typing import AsyncGenerator, Optional
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GeminiLiveService:
    """
    Handles the real-time interaction with Gemini 2.5 Flash Native Audio via the Live API.
    Enforces the 'Minglish Coach' persona for Bol.AI.
    """
    
    def __init__(self):
        # Initialize the GenAI client using the API key from environment
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is not set.")
        
        # Use v1alpha for Multimodal Live API
        print("API Key:", self.api_key)
        self.client = genai.Client(
            api_key=self.api_key, 
            http_options={'api_version': 'v1alpha'}
        )
        
        # THE FIX: Using the exact model your key has access to, with the "latest" auto-fallback alias!
        self.model_id = "gemini-2.5-flash-native-audio-latest"
        
        # System instruction from spec.md
        self.system_instruction = (
            "You are Bol.AI, a highly premium, strict-but-friendly spoken English fluency coach "
            "designed for users in Pakistan. Your goal is to help the user speak confident, professional English.\n\n"
            "CRITICAL RULES:\n"
            "1. You understand Roman Urdu and 'Minglish' perfectly.\n"
            "2. If the user speaks in a mix of Urdu and English (e.g., 'I was trying to go but meri gari kharab ho gayi'), "
            "you must gently interrupt them, acknowledge what they meant, and provide the correct, natural English phrasing to repeat.\n"
            "3. Keep your responses short, conversational, and punchy. Do not give long lectures.\n"
            "4. You must allow the user to interrupt you at any time. If they say 'Wait' or 'Stop', stop immediately and listen.\n"
            "5. If the user provides an image (Vision mode), analyze the context of the image (e.g., a restaurant menu, a job application) "
            "and immediately initiate a relevant roleplay scenario to practice speaking."
        )

    async def get_session(self):
        """
        Returns the async context manager for a Gemini Live session.
        Usage: async with await service.get_session() as session:
        """
        config = types.LiveConnectConfig(
            system_instruction=self.system_instruction,
            response_modalities=["AUDIO"]
        )
        
        # In latest google-genai, live is under the aio namespace for async
        return self.client.aio.live.connect(model=self.model_id, config=config)