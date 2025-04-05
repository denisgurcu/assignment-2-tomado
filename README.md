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

## 📆 Tech Stack

| Layer      | Stack / Library                                  |
|------------|--------------------------------------------------|
| Frontend   | React (Vite), CSS Modules                        |
| Backend    | Node.js, Express                                 |
| Database   | MySQL                                            |
| Packages   | multer, mysql2, body-parser, cors, emoji-picker-react, @hello-pangea/dnd, nodemon |

---

## ⚙️ How to Run Locally

### 1. Set up the Backend (API)

```bash
cd assignment-2-tomado/api
npm install
```

- Create a MySQL database
- Import the SQL schema:

```bash
mysql -u root -p tomado_db < tomado_db.sql
```

- The `db.js` is configured for local MySQL with `root`/`root`.

- Start the backend using nodemon:

```bash
npm run dev
```

> Backend runs at: `http://localhost:3000`

### 2. Set up the Frontend

```bash
cd ../web
npm install
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---

## 🔗 Notes for Instructor

- All required CRUD operations are implemented.
- Routes are modular using Express routers.
- Uploaded files are handled with `multer` and served from a static directory.
- Includes 2 MySQL tables: `tasks` and `categories` (linked via foreign key).
- Tasks can be filtered, edited, and visualized using Pomodoro productivity logic.
- The exported `.sql` file is provided in `/api/tomado-db.sql`.

---


