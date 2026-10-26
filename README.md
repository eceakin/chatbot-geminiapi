# Gemini Chatbot (React)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)

A customer-support chatbot built with **React** and the **Google Gemini API**. It answers questions about a fictional business, *Sweet Crumbs Bakery* (menu, prices, opening hours, contact details), by grounding the model in a block of company information that is sent with every conversation.

The same chatbot is embedded in a full cafe website in [web_cafe_ai](https://github.com/eceakin/web_cafe_ai).

---

## Features

- **Context-grounded answers**: business information in `src/companyInfo.js` is injected as a hidden first message, so the model answers as the bakery's assistant
- **Multi-turn memory**: the whole conversation is sent with each request, so follow-up questions keep their context
- **Typing indicator**: a "Thinking..." message appears while waiting and is replaced by the reply
- **Error handling**: API errors are shown in the chat as error messages instead of failing silently
- **Clean output**: Markdown bold markers (`**text**`) are stripped from replies
- **Auto-scroll** to the newest message

## How it works

```
User message ──► ChatForm ──► chat history (React state)
                                   │
                                   ▼
          [ hidden companyInfo, user, model, user, … ]
                                   │  mapped to Gemini format:
                                   │  { role, parts: [{ text }] }
                                   ▼
          POST generativelanguage.googleapis.com/…/gemini-2.5-flash:generateContent
                                   │
                                   ▼
          candidates[0].content.parts[0].text ──► ChatMessage
```

| File | Role |
|---|---|
| `src/App.jsx` | Chat window, history state, Gemini API call |
| `src/components/ChatForm.jsx` | Input field; adds the user message and the "Thinking..." placeholder |
| `src/components/ChatMessage.jsx` | Renders user, bot and error messages; skips hidden context messages |
| `src/components/ChatbotIcon.jsx` | SVG bot avatar |
| `src/companyInfo.js` | Business knowledge the bot uses |

## Getting started

### Prerequisites

- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

```bash
git clone https://github.com/eceakin/chatbot-geminiapi.git
cd chatbot-geminiapi
npm install
cp .env.example .env
```

Put your key into `.env`:

```env
VITE_API_URL=https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=YOUR_GEMINI_API_KEY
```

`.env` is git-ignored, so the key never ends up in the repository.

### Run

```bash
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

## Customising the bot

Edit `src/companyInfo.js` to describe a different business: its introduction, location, hours, contact details and menu. The model uses only what you put there plus its general knowledge, so no code changes are needed.

To use another Gemini model, change the model name in `VITE_API_URL`.

## Security note

Variables prefixed with `VITE_` are **bundled into the client-side JavaScript**, so the API key is visible to anyone who opens the deployed site. That is fine for local development and demos. For a public deployment, move the Gemini call to a small backend or serverless function that keeps the key on the server, and have the frontend call that endpoint instead.

## Tech stack

React 19 · Vite · Google Gemini API (`gemini-2.5-flash`) · Fetch API · Material Symbols
