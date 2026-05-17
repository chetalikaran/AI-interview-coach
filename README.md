# AI Confidence Coach for Interviews

AI Confidence Coach for Interviews is a MERN stack and Generative AI project that helps users prepare for job interviews with personalized questions, answer feedback, confidence scoring, and interview history.

The project is built as a production-style learning app for MERN stack beginners who want to understand how React, Express, MongoDB, authentication, and OpenAI integration work together.

## Features

- User registration and login with JWT authentication
- Resume upload UI
- Job description input
- AI-ready interview question generation
- Answer feedback with confidence score
- Strengths and improvement suggestions
- Interview session history dashboard
- MongoDB persistence with Mongoose
- OpenAI API integration with mock fallback when no API key is configured
- Responsive dark-mode React UI with Tailwind CSS

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Lucide React icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- OpenAI SDK

## Project Structure

```txt
.
├── client
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/chetalikaran/AI-interview-coach.git
cd AI-interview-coach
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` folder:

```bash
PORT=5000
CLIENT_URL=http://127.0.0.1:5173
MONGO_URI=mongodb://127.0.0.1:27017/ai-confidence-coach
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1d
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.2
```

If `OPENAI_API_KEY` is empty, the app will use mock AI responses so the project can still be tested locally.

### 5. Start MongoDB

Make sure MongoDB is running locally on:

```txt
mongodb://127.0.0.1:27017
```

### 6. Start the Backend

```bash
cd server
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

### 7. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend runs on:

```txt
http://127.0.0.1:5173
```

## Test Flow

1. Register a user.
2. Login.
3. Go to Interview Setup.
4. Upload a resume file.
5. Paste a job description.
6. Generate interview questions.
7. Select a question.
8. Submit an answer.
9. View AI feedback and confidence score.
10. Open the dashboard to see saved interview sessions.

## Current API Routes

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Interviews

```txt
POST /api/interviews/sessions
GET  /api/interviews/sessions
POST /api/interviews/sessions/:sessionId/answers
```

## Roadmap

- Add real resume parsing
- Improve OpenAI prompts for better interview coaching
- Add dashboard analytics
- Add average confidence score trends
- Add interview history details page
- Add protected frontend routes
- Add deployment setup
- Add voice interview simulation
- Add webcam confidence analysis as a future advanced feature

## Learning Goals

This project is designed to teach:

- How MERN stack apps are structured
- How frontend and backend communicate through APIs
- How JWT authentication works
- How MongoDB stores user-specific data
- How to keep API keys secure on the backend
- How to add GenAI features incrementally
- How to build a production-style project as a beginner

## Author

Built by [Chetali Karan](https://github.com/chetalikaran).
