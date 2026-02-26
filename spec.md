# Project: Bol.AI (Hackathon Build)
# Category: Gemini Live Agent Challenge (Live Agents 🗣️)

## 1. Project Overview
Bol.AI is a real-time, interruptible English fluency co-pilot designed specifically for the Pakistani demographic. It helps users transition from thinking in Roman Urdu/Minglish to speaking fluent English. It uses the Gemini Live API for real-time audio interaction, handles code-switching gracefully, and uses vision for situational roleplay.

## 2. Tech Stack
* **Frontend:** React Native (Expo) - Mobile first.
* **Backend:** Python (FastAPI) - Hosted on Google Cloud Run.
* **AI Integration:** Google GenAI SDK (Gemini 1.5 Pro/Flash via Live API).
* **Database & Auth:** Supabase (PostgreSQL + Google OAuth 2.0).

## 3. UI/UX Vibe (Strict Rules)
* **Theme:** "Modern Executive" - Dark mode only.
* **Colors:** Deep charcoal/slate (`#121418`) background. Accents in metallic gold (`#D4AF37`) or futuristic electric cyan (`#00E5FF`).
* **Components:** Use glassmorphism (frosted glass) for cards and modals.
* **Core Screen:** The live session screen has NO text chat. It features a glowing, audio-reactive animated orb/soundwave in the center.

## 4. The System Prompt (Core AI Persona)
Whenever initializing the Gemini Live API, use the following system prompt strictly:

> "You are Bol.AI, a highly premium, strict-but-friendly spoken English fluency coach designed for users in Pakistan. Your goal is to help the user speak confident, professional English. 
> 
> CRITICAL RULES:
> 1. You understand Roman Urdu and 'Minglish' perfectly. 
> 2. If the user speaks in a mix of Urdu and English (e.g., 'I was trying to go but meri gari kharab ho gayi'), you must gently interrupt them, acknowledge what they meant, and provide the correct, natural English phrasing to repeat.
> 3. Keep your responses short, conversational, and punchy. Do not give long lectures. 
> 4. You must allow the user to interrupt you at any time. If they say 'Wait' or 'Stop', stop immediately and listen.
> 5. If the user provides an image (Vision mode), analyze the context of the image (e.g., a restaurant menu, a job application) and immediately initiate a relevant roleplay scenario to practice speaking."

## 5. Development Phases (One Move at a Time)
Do not proceed to the next move without explicit user approval.
* **Move 1:** Initialize Expo React Native app and Python FastAPI backend structure.
* **Move 2:** Implement Supabase Google OAuth in the frontend and set up the PostgreSQL 'Vocab Vault' schema.
* **Move 3:** Create the Python backend logic using the Google GenAI SDK to establish the Gemini Live API connection.
* **Move 4:** Build the React Native UI (Dark theme, glowing orb) and establish the WebRTC/WebSocket connection to the Python backend for live audio.
* **Move 5:** Implement the Camera feature in React Native to send image frames to the backend for multimodal roleplay.