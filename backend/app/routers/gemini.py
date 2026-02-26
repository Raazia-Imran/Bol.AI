import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.gemini_service import GeminiLiveService
from google.genai import types

router = APIRouter()

@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket bridge between the Expo app and Gemini Live API.
    Handles real-time audio streaming and interrupts.
    """
    await websocket.accept()
    
    service = GeminiLiveService()
    
    try:
        # Establish connection to Gemini Live API
        async with await service.get_session() as session:
            
            async def receive_from_client():
                """Task to listen for audio/messages from the Expo frontend."""
                try:
                    while True:
                        # Receive message from client (can be bytes for audio or text for vision/JSON)
                        message = await websocket.receive()
                        
                        if "bytes" in message:
                            # Send raw audio bytes to Gemini
                            await session.send(input=message["bytes"], end_of_turn=False)
                        
                        elif "text" in message:
                            # Handle JSON messages (e.g., sending image frames for Vision mode)
                            data = json.loads(message["text"])
                            if data.get("type") == "image":
                                # Send image to Gemini (Vision Mode)
                                await session.send(
                                    input=types.Content(
                                        parts=[types.Part(inline_data=types.Blob(
                                            mime_type="image/jpeg",
                                            data=data["data"] # Base64 string
                                        ))]
                                    ),
                                    end_of_turn=True
                                )
                except WebSocketDisconnect:
                    pass
                except Exception as e:
                    print(f"Error receiving from client: {e}")

            async def send_to_client():
                """Task to stream Gemini's responses back to the Expo frontend."""
                try:
                    async for response in session.receive():
                        if response.server_content and response.server_content.model_draft:
                            parts = response.server_content.model_draft.parts
                            for part in parts:
                                if part.inline_data:
                                    # Send audio bytes back to client
                                    await websocket.send_bytes(part.inline_data.data)
                                elif part.text:
                                    # If Gemini sends text (unlikely in pure audio mode, but safe to handle)
                                    await websocket.send_json({"type": "text", "content": part.text})
                        
                        # Handle interrupts/turn completion if needed
                        if response.server_content and response.server_content.turn_complete:
                            await websocket.send_json({"type": "turn_complete"})

                except Exception as e:
                    print(f"Error streaming from Gemini: {e}")

            # Run both tasks concurrently
            await asyncio.gather(receive_from_client(), send_to_client())

    except WebSocketDisconnect:
        print("Client disconnected.")
    except Exception as e:
        print(f"Session failed: {e}")
        await websocket.close(code=1011)
