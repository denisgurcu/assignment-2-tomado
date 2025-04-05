# 🍅 TomaDo – Task Manager + Pomodoro App

**TomaDo** is a full-stack productivity app. 

## 👨‍💼 Built for **Airrick Dunfield**  

---
It blends a drag-and-drop task board with a Pomodoro timer, letting users organize tasks, manage images, and focus through cycles.

---

## ✨ Features

- Drag and drop tasks across columns (Not Started, In Progress, Done)
- Add, edit, and delete tasks with optional image and category
- Upload + preview images (with delete option)
- Filter tasks by custom emoji-supported categories
- Pomodoro timer with automatic cycles and sound cues
- "Done" tasks appear with strike-through for clarity
- Interactive front-end built with React

---

## ⏱️ Pomodoro Logic

- 25 minutes of focus → 5-minute short break
- After 4 focus sessions → 15-minute long break
- Automatic transitions with unique sounds for each stage
- Timer resets after completing one full Pomodoro cycle
- Timer runs alongside the task board without interruptions

---

## 📦 Tech Stack

| Layer      | Stack / Library                                  |
|------------|--------------------------------------------------|
| Frontend   | React (Vite), CSS Modules                        |
| Backend    | Node.js, Express                                 |
| Database   | MySQL                                            |
| Packages   | multer, mysql2, body-parser, cors, emoji-picker-react, @hello-pangea/dnd |

---

## 📁 Project Structure

```
assignment-2/
├── api/                        # Express backend
│   ├── db.js                   # MySQL connection
│   ├── index.js                # Entry point
│   ├── storage.js              # Multer setup
│   ├── exported-db.sql         # SQL schema + seed
│   ├── uploads/                # Uploaded images
│   └── routers/
│       ├── tasks.js            # Task routes (CRUD + file upload)
│       └── categories.js       # Category routes
│
└── web/                        # React frontend
    ├── App.jsx
    ├── main.jsx
    └── components/
        ├── TaskBoard.jsx
        ├── TaskCard.jsx
        ├── AddTaskModal.jsx
        ├── EditTaskModal.jsx
        ├── CategoryFilter.jsx
        └── PomodoroTimer.jsx
```

---

## ⚙️ How to Run Locally

### 1. Set up the Backend (API)

```bash
cd assignment-2/api
npm install
```

- Create a MySQL database
- Import the SQL schema:

```bash
mysql -u youruser -p yourdb < exported-db.sql
```

- The db.js is configured for local MySQL with root/root, but feel free to adjust these settings based on your environment. Use the included exported-db.sql to recreate the database schema and test data."


- Start the backend:

```bash
npm run dev
```

> Backend runs at: `http://localhost:3000`

### 2. Set up the Frontend

```bash
cd web
npm install
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---





