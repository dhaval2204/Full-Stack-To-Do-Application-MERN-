# TaskFlow — Full Stack Next.js Todo App

A complete full-stack Todo application built with **Next.js 14**, **MongoDB**, **JWT Authentication**, and a beautiful dark UI.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally **OR** a MongoDB Atlas connection string

---

### Step 1 — Install Dependencies

```bash
npm install
```

---

### Step 2 — Configure Environment Variables

Open `.env.local` and update:

```env
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your_super_secret_key_change_this
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> 💡 **Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todoapp`

---

### Step 3 — Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
todo-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST /api/auth/login
│   │   │   └── register/route.ts    # POST /api/auth/register
│   │   └── tasks/
│   │       ├── route.ts             # GET, POST /api/tasks
│   │       └── [id]/route.ts        # PUT, DELETE /api/tasks/:id
│   ├── dashboard/page.tsx           # Dashboard (protected)
│   ├── login/page.tsx               # Login page
│   ├── register/page.tsx            # Register page
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Root redirect
├── components/
│   └── AuthContext.tsx              # Auth state + JWT management
├── lib/
│   ├── mongodb.ts                   # Mongoose connection
│   └── jwt.ts                       # JWT sign/verify helpers
├── middleware/
│   └── auth.ts                      # JWT auth middleware
├── models/
│   ├── User.ts                      # User Mongoose model
│   └── Task.ts                      # Task Mongoose model
├── .env.local                       # Environment variables
└── package.json
```

---

## ✨ Features

### Auth
- ✅ User Registration (Name, Email, Password)
- ✅ User Login with JWT
- ✅ Protected routes (dashboard requires login)
- ✅ Auto-redirect after login/logout
- ✅ Persistent login via localStorage

### Tasks
- ✅ Create task (title, description, priority)
- ✅ View all tasks (user-specific)
- ✅ Mark task as completed / pending
- ✅ Edit task (title, description, priority)
- ✅ Delete task with confirmation
- ✅ Filter: All / Pending / Completed
- ✅ Progress bar
- ✅ Stats (Total / Completed / Pending)
- ✅ Priority levels (Low 🟢 / Medium 🟡 / High 🔴)

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/tasks` | Get all tasks | ✅ |
| GET | `/api/tasks?filter=completed` | Filter tasks | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Frontend | React 18, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Password | bcryptjs |
| HTTP Client | Axios |
| Language | TypeScript |
