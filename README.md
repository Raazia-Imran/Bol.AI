# Bol.AI 🎙️

**Speak with confidence.**
Bol.AI is a real-time, interactive English fluency coach built for Pakistan. It provides instant, conversational feedback using low-latency WebSockets and native audio streaming.

---

## 🚀 Project Status

### Frontend (React Native / Expo SDK 54)

* **UI/UX:** Core screens implemented (Get Started, Dashboard, Tabs).
* **Authentication:** Google OAuth fully integrated via Supabase.
* **Native Capabilities:** Uses a custom Expo Development Build (not Expo Go) to support raw file system access and high-quality native audio streaming.

### Backend (Python / FastAPI)

* **Architecture:** FastAPI application served with Uvicorn and CORS enabled for mobile clients.
* **Real-time Streaming:** Bi-directional WebSocket route (`/gemini/ws/chat`) for live audio streaming to the AI model.

---

## 🛠️ Tech Stack

* **Frontend:** React Native, Expo, TypeScript, NativeWind (Tailwind CSS)
* **Backend:** Python 3.x, FastAPI, Uvicorn, WebSockets
* **Auth & Database:** Supabase
* **AI:** Google Gemini 2.5 Flash (native audio)

---

## ⚙️ Local Development Setup

⚠️ **Important:** This project uses native device features (microphone, raw audio streaming). **Expo Go cannot be used to test core AI features.** You must run a **Development Build**.

Follow the steps below **in order**.

---

## Part 1: Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

* **Windows:**

```bash
venv\Scripts\activate
```

* **macOS / Linux:**

```bash
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Create a `.env` file inside the `backend` folder:

```env
GOOGLE_API_KEY=AIzaSyYourKeyHere
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhb...
```

⚠️ **Rules:**

* No quotes
* No extra spaces
* Never commit this file

6. Start the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --env-file .env
```

The backend should now be running on:

```
http://0.0.0.0:8000
```

---

## Part 2: Frontend Setup (Expo / React Native)

Open a **new terminal window**.

1. Navigate to the frontend folder:

```bash
cd frontend
npm install
```

2. Create a `.env` file in the `frontend` folder:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
```

---

## Running the App

### Method A: Expo Go (UI Only)

✅ Use this **only** for UI work (layouts, colors, text).

❌ Audio streaming, file system access, and AI features will fail.

1. Install **Expo Go** on your phone.
2. Run:

```bash
npx expo start
```

3. Scan the QR code.

---

### Method B: Development Build ⭐ REQUIRED ⭐

Use this method to test:

* Google Login
* Audio recording
* Real-time Gemini interaction

#### Android (Windows)

**Prerequisites:**

* Java 17 installed
* Android Studio installed
* ANDROID_HOME and JAVA_HOME set in System Environment Variables

**Steps:**

1. Connect your physical Android device via USB.
2. Enable **Developer Options → USB Debugging**.
3. Run:

```bash
npx expo run:android
```

⏳ First build may take 10–20 minutes. This is normal.

4. A custom **Bol.AI** app will install on your phone.
5. Open the app — it will automatically connect to your local dev server.

---

## 🚨 Common Troubleshooting

### Google Login Redirects Back to Start

* Ensure the redirect scheme in `login.tsx` is:

```ts
scheme: 'frontend'
```

* Add the following to Supabase Auth → URL Configuration:

```
frontend://
```

### WebSocket Connection Refused

* Find your laptop's local IP address:

```bash
ipconfig
```

* Example: `192.168.0.104`
* Update the WebSocket URL in:

```
frontend/hooks/useGeminiLive.ts
```

### Android SDK / Java Not Found

* Restart VS Code and all terminals
* Confirm ANDROID_HOME and JAVA_HOME are correctly set

---

## 📌 Note

* Always start the **backend first**
* Use **Development Build**, not Expo Go, for real testing
* Keep phone and laptop on the **same Wi-Fi network**

---

## 📄 License

Will be protected

---

Happy building 🚀
