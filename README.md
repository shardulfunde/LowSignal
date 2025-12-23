# Low-Signal-AI

Low-Signal-AI is a FastAPI-based backend system that generates personalized learning paths, topic-wise explanations, and MCQ tests using LLM-driven prompt templates. The focus is on reducing educational noise and providing structured, goal-oriented guidance.

---

## Features

### Learning Path Generator
- Generates step-by-step study plans based on subject, age, learning focus, and preferred language.
- Ensures logical topic progression instead of random content.

### Test Generator
- Creates topic-specific MCQ tests.
- Enforces minimum and maximum question limits.
- Uses schema validation for clean, predictable outputs.

### Chatbot
- Interactive system for doubt solving and concept explanations.
- Designed to provide clarity rather than shallow answers.

### Structured Outputs
- All responses follow predefined templates.
- Prevents unstructured or hallucinated results.

---

## 📂 Project Structure

```text
Low-Signal-AI-main/
├── Chatbot/
│   └── chatbot.py                   # Logic for streaming AI chat responses using LangChain
├── Data_Templates/
│   ├── learning_path_templates.py   # Pydantic data models for learning path structure
│   └── test_generation_templates.py # Pydantic data models for MCQ test structure
├── testGenerator/
│   └── generate_test.py             # AI logic for generating MCQ tests via Cerebras
├── .gitignore                       # Specifies files to be ignored by Git
├── learningpath.py                  # Orchestration logic for generating syllabus and topic details
├── main.py                          # Main FastAPI application entry point defining all API routes
├── README.md                        # Project documentation
└── requirements.txt                 # List of Python dependencies (FastAPI, LangChain, etc.)

# API Documentation & Learning Path Generation

This document outlines the available API endpoints for the **Low-Signal-AI** application and provides detailed specifications for the "Generate Full Learning Path" feature.
```

## 🔌 API Endpoints

The application exposes the following endpoints via **FastAPI**:

### 1. Health Check
* **Method:** `GET`
* **Path:** `/`
* **Description:** verifies that the API is running.
* **Response:** `{"Status": "Ok"}`

### 2. Chat Stream
* **Method:** `GET`
* **Path:** `/chat/stream`
* **Query Parameter:** `question` (string)
* **Description:** Streams an AI response token-by-token using Server-Sent Events (SSE).
* **Response:** `text/event-stream`

### 3. Generate Test (MCQ)
* **Method:** `POST`
* **Path:** `/test/generate`
* **Description:** Generates a multiple-choice test based on the provided topic and difficulty.
* **Request Body (JSON):**
    ```json
    {
      "topic": "string",
      "difficulty": "easy" | "medium" | "hard",
      "num_questions": int (1-20),
      "language": "en" | "hi" | "mr"
    }
    ```
* **Response:** JSON object containing a list of questions with options and the correct answer index.

### 4. Generate Full Learning Path
* **Method:** `POST`
* **Path:** `/learning_path/generate`
* **Description:** Creates a complete curriculum. It first generates a list of topics (syllabus) and then expands on *each* topic with detailed explanations and practice questions.
* **Response Model:** `LearningPathOutPut`

### 5. Generate Topic List (Syllabus Only)
* **Method:** `POST`
* **Path:** `/learning_path/generate/topic_list`
* **Description:** Generates only the ordered list of topics without detailed content.
* **Response Model:** `TopicList`

### 6. Generate Topic Detail
* **Method:** `POST`
* **Path:** `/learning_path/generate/topic_detail`
* **Description:** Generates a detailed explanation for a single, specific topic.
* **Response Model:** `Topic`

---

## 🎓 Feature Spotlight: Generate Full Learning Path

This feature uses a two-step AI chain to build a personalized curriculum.

### Endpoint
`POST /learning_path/generate`

### How It Works
1.  **Planning Phase:** The AI (`qwen-3-235b` via Cerebras) accepts the subject, age, and language. It acts as a curriculum designer to create a structured list of 6-8 topics, ordered from basic to advanced.
2.  **Expansion Phase:** The system iterates through the generated list. For each topic, it acts as an expert tutor to generate a detailed explanation and 2-3 practice questions.

### Request Payload Example
```json
{
  "subject": "Basic Python",
  "year_old": 15,
  "preferred_language": "en",
  "focus_areas": ["Loops", "Functions"]
}
