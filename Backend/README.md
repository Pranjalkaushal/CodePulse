# CodeRank Backend

## Project Overview
CodeRank is a campus coding analytics platform. This backend provides authentication and stores LeetCode-derived stats in MongoDB.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- LeetCode data via `alfa-leetcode-api` (`https://alfa-leetcode-api.onrender.com/`)

## Setup Instructions

### 1) Clone repo
Clone the repository and open it locally.

### 2) Go to backend folder
```bash
cd Backend
```

### 3) Install dependencies
```bash
npm install
```

### 4) Create `.env`
Create `Backend/.env`:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
```

### 5) Start server
```bash
npm start
```

Server will run on `http://localhost:5000`.

## API Endpoints

### Auth
- `POST /api/auth/register`
  - Body:
    - `name` (string)
    - `email` (string)
    - `password` (string)
    - `leetcodeUsername` (string, required)
  - Returns: `{ token, user }`
  - Notes: Registration fetches LeetCode stats; invalid usernames return an error message.

- `POST /api/auth/login`
  - Body:
    - `email` (string)
    - `password` (string)
  - Returns: `{ token, user }`

## Notes
- Requires internet access to fetch LeetCode stats from the external API.
- MongoDB Atlas (or local MongoDB) is required.

