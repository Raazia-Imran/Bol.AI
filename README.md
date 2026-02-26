

```markdown
# Bol.AI 🎙️

**Speak with confidence.**
Bol.AI is a real-time, interactive English fluency coach built for Pakistan. It leverages Google's Gemini Multimodal Live API to provide instant, conversational feedback through low-latency WebSockets.

---

## 🚀 Project Status: What is built so far?

**Frontend (React Native / Expo SDK 54):**
* **UI/UX:** Core screens are implemented (Get Started, Dashboard, Tab layout).
* **Authentication:** Fully working Google OAuth integration via Supabase. 
* **Native Infrastructure:** Upgraded from standard "Expo Go" to a Custom Native Development Build to support raw file system access and high-fidelity native audio streaming.

**Backend (Python / FastAPI):**
* **Architecture:** Uvicorn server setup with CORS middleware configured for React Native.
* **WebSocket Tunnel:** Bi-directional streaming route (`/gemini/ws/chat`) established to pipe audio directly to the Gemini 2.5 Flash model.

---

## 🛠️ Tech Stack
* **Frontend:** React Native, Expo, TypeScript, Tailwind CSS (NativeWind)
* **Backend:** Python 3.x, FastAPI, Uvicorn, WebSockets
* **Database/Auth:** Supabase
* **AI:** Google Gemini 2.5 Flash (Native Audio)

---

## ⚙️ Local Development Setup

Because this app uses native hardware features (microphone, raw audio streaming), **you cannot simply use the standard Expo Go app to test the core AI features.** You will need to run a "Development Build". 

Please follow these instructions strictly in order.

### Part 1: Start the Python Backend

1. **Open a terminal** and navigate to the backend folder:
   ```bash
   cd backend

```

2. **Create a virtual environment** (so you don't mess up your global Python installation):
```bash
python -m venv venv

```


3. **Activate the environment:**
* *Windows:* `venv\Scripts\activate`
* *Mac/Linux:* `source venv/bin/activate`


4. **Install the dependencies:**
```bash
pip install -r requirements.txt

```


5. **Set up Environment Variables:**
* Create a file named `.env` in the `backend` folder.
* Add your Google API key and Supabase keys.
* *CRITICAL:* Do not use quotes or spaces!
```env
GOOGLE_API_KEY=AIzaSyYourKeyHere...
SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
SUPABASE_ANON_KEY=eyJhb...

```




6. **Start the server:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --env-file .env

```



---

### Part 2: Start the React Native Frontend

Open a **new** terminal window and navigate to the frontend folder:

```bash
cd frontend
npm install

```

**Set up Frontend Environment Variables:**
Create a `.env` file in the `frontend` folder and add your Supabase keys:

```env
EXPO_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhb...

```

#### Method A: The Quick UI Test (Expo Go)

*Use this ONLY if you are designing UI elements (buttons, colors, text). Native audio and file systems will crash here.*

1. Download the **Expo Go** app on your physical iPhone or Android.
2. Run this command in your terminal:
```bash
npx expo start

```


3. Scan the QR code with your phone's camera.

#### Method B: The Full App (Development Build) ⭐️ REQUIRED FOR AI FEATURES ⭐️

*Use this to test the actual application, Google Login, and Gemini Audio.*

**Prerequisites for Windows/Android:**

* You must have **Java 17** installed.
* You must have Android Studio installed to get the Android SDK.
* Your `ANDROID_HOME` and `JAVA_HOME` environment variables MUST be set in your Windows System Properties.

**Steps to Build:**

1. Plug your physical Android phone into your laptop via USB.
2. Ensure **"USB Debugging"** is turned ON in your phone's Developer Options.
3. Run the build command:
```bash
npx expo run:android

```


*(Note: The first time you run this, it will take 10–20 minutes to download Gradle and compile the C++/Java code. Be patient. Subsequent builds take seconds).*
4. Once finished, a custom `Bol.AI` app icon will appear on your phone. Open it, and it will automatically connect to your laptop's server!

---

## 🚨 Common Troubleshooting for Teammates

* **Google Login Loops Back to Start:** Ensure your `login.tsx` redirect URI is set to `scheme: 'frontend'` and that `frontend://` is added to your Supabase Authentication URL Configuration dashboard.
* **WebSocket Connection Refused:** The frontend needs to know where your backend is. Open a command prompt, type `ipconfig`, find your laptop's **IPv4 Address** (e.g., `192.168.0.104`), and update the `wsUrl` inside `frontend/hooks/useGeminiLive.ts`.
* **SDK Not Found Error:** Restart your VS Code and terminal so it can read your newly added `ANDROID_HOME` variable.

```

