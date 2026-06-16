# Teacher Meeting Scheduler & Attendance Management System

A centralized platform for scheduling meetings with Google Meet, automating calendar management, attendance tracking, and reporting.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **APIs:** Google OAuth 2.0, Google Calendar API
- **Background Jobs:** BullMQ, Redis

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **Docker Desktop** (Must be running before starting the app)
- *(Optional)* Google Cloud Project with OAuth 2.0 and Calendar API enabled

---

## ⚙️ Step-by-Step Installation & Run Guide

Follow these exact steps to get the project running smoothly on your local machine.

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd "Raj Groups"
```

### Step 2: Start the Databases (MongoDB & Redis)
The backend requires MongoDB for data storage and Redis for background email reminders. 
*Note: Make sure the Docker Desktop app is open and running on your Mac/PC before running this command.*

```bash
docker-compose up -d
```
You should see output indicating that `tms_mongodb` and `tms_redis` have started.

### Step 3: Setup and Start the Backend
Open a **new terminal tab** and navigate to the backend directory:
```bash
cd backend
```
Install the dependencies:
```bash
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/teacher_scheduler
JWT_SECRET=super_secret_jwt_key_for_development
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5001/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```
Start the backend server:
```bash
npm run dev
```
*You should see "MongoDB Connected..." and "Server running in development mode on port 5001".*

### Step 4: Setup and Start the Frontend
Open a **third terminal tab** and navigate to the frontend directory:
```bash
cd frontend
```
Install the dependencies:
```bash
npm install
```
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```
Start the frontend development server:
```bash
npm run dev
```

### Step 5: View the Application!
Open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Testing the Application (Dev Bypass)

Because setting up a Google Cloud Project with OAuth credentials can be tedious, this project includes a built-in **Developer Bypass**!

1. Go to `http://localhost:3000`.
2. Instead of clicking "Continue with Google", click the **"Dev Bypass (Mock Login)"** button.
3. This will instantly log you in as a Mock Teacher so you can explore the dashboard, schedule meetings, and test the UI without needing real Google APIs.
4. If you want to test the Candidate view, open an Incognito window, click the bypass button again, and any subsequent logins are automatically assigned the "Candidate" role!

---

## 🔐 Setting up Real Google OAuth
For the application to fully work with real Google Meet link generation:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the **Google Calendar API**.
4. Configure the OAuth Consent Screen and add test users.
5. Create OAuth Client ID credentials (Web application).
6. Set the Authorized redirect URI to `http://localhost:5001/api/auth/google/callback`.
7. Copy your `Client ID` and `Client Secret` into the `backend/.env` file.
