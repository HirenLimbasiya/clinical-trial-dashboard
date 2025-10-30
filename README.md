# Clinical Trial Analytics Dashboard

A full-stack web application for analyzing clinical trial data with interactive visualizations. Built with Node.js, Express, MongoDB, React, and Redux.

## Features

- **Dashboard**: Overview with key metrics and interactive charts
- **Search**: Find clinical trials by facility name
- **Officials**: Browse research leaders with pagination
- **Analytics**: Location distribution, demographics, and city-wise trial data

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose  
**Frontend:** React, Redux Toolkit, Recharts, Lucide React

---

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure `.env` file:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/clinical-trials
MONGODB_POOL_SIZE=10
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Required Variables:**
- `MONGODB_URI` - MongoDB connection string (local or Atlas)

5. Import data:
```bash
npm run seed
```

6. Start backend:
```bash
npm run dev
```

Backend will run at `http://localhost:5001`

---

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:5001/api
```

**Required Variables:**
- `REACT_APP_API_BASE_URL` - Backend API URL

5. Start frontend:
```bash
npm start
```

Frontend will run at `http://localhost:3000`

---

## Quick Start

```bash
# Terminal 1 - Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm start
```

Application will open automatically at `http://localhost:3000`