# LowSignal — Frontend

LowSignal is the **frontend application** for an offline-first, multilingual AI learning platform designed for rural and low-connectivity regions. This repository contains the user-facing interface that enables students to access personalized learning paths, adaptive tests, and level-aware explanations powered by the Low-Signal-AI backend.

The frontend is built with a strong focus on **simplicity, low-bandwidth usability, and accessibility**, ensuring smooth usage on low-end devices.

---

## 🌟 Features

- Offline-first learning experience
- Multilingual UI with regional language support
- Voice-based interaction for easier learning
- Personalized learning paths powered by AI
- Adaptive MCQ tests and progress tracking
- Gamified UI to improve engagement
- Seamless integration with AI backend APIs

---

## 🔗 Backend Integration

This frontend connects to the **Low-Signal-AI backend** for all AI-powered features such as learning path generation, tests, and explanations.

### Backend Repository  
👉 https://github.com/shardulfunde/Low-Signal-AI

---

## 🛠️ Tech Stack (Frontend)

- Web Framework: React / Next.js *(update if different)*
- Styling: Tailwind CSS *(update if different)*
- API Communication: REST APIs
- State Management: Context API / Redux *(optional)*
- Offline Support: Local storage / IndexedDB

---

## ⚙️ Setup & Installation

1. **Clone the repository**
```bash
git clone <frontend-repository-url>
cd LowSignal
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Backend URL**

Create a `.env` file in the root directory:
```env
VITE_BACKEND_URL=http://localhost:8000
```

4. **Run the frontend**
```bash
npm run dev
```

---

## 🔁 API Usage (From Frontend)

The frontend consumes these backend endpoints:
- `/learning_path/generate`
- `/learning_path/generate/topic_list`
- `/learning_path/generate/topic_detail`
- `/test/generate`
- `/chat/stream` (SSE)

---

## 📌 Design Philosophy

- Built for real rural constraints, not ideal conditions
- Clear, level-aware explanations instead of generic answers
- Offline-first mindset with graceful AI fallback
- UI designed for students, not just power users

---

## 📘 BACKEND README (Reference)

**Repository:** https://github.com/shardulfunde/Low-Signal-AI

### 🛠️ Tech Stack for Backend
- **Framework:** FastAPI  
- **Server:** Uvicorn  
- **AI/LLM Orchestration:** LangChain  
- **Inference Provider:** Cerebras  
- **Models Used:** `gemini-2.5-flash-lite`

### 📋 Prerequisites
- Python 3.9+
- Google Gemini API Key
- Cerebras API Key (optional)

### 📦 Installation
```bash
git clone https://github.com/shardulfunde/Low-Signal-AI
cd Low-Signal-AI
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 🔐 Environment Variables
```env
CEREBRAS_API_KEY=your_cerebras_api_key_here
# GOOGLE_API_KEY=your_google_key
```

### 🏃‍♂️ Running Backend
```bash
uvicorn main:app --reload
```

---

## 📄 License

MIT
