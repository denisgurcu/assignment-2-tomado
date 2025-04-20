# 🍅 TomaDo – Task Manager + Pomodoro App

**TomaDo** is a full-stack productivity app.

## 👨‍💼 Built for **Airrick Dunfield**

---

It blends a drag-and-drop task board with a Pomodoro timer, letting users organize tasks, manage images, and focus through cycles.

---

## 🚧 **Work In Progress**

This project is currently under development. Here's the current status:

### ✅ **Things That Work**:
- **User Authentication**:
  - Users can register and login.
  - Users cannot access the app unless logged in (future update will allow public access).
  - User login works and persists across browser sessions.
- **Task Management**:
  - Users can add tasks under their specific account.
  - Tasks are saved to local storage and persist across sessions.
  - Users can delete tasks, and changes are saved to local storage.

### ❌ **Things That Don't Work (Yet)**:
- Editing tasks.
- Adding, editing, or deleting categories.

---

## 📆 Tech Stack

| Layer      | Stack / Library                                  |
|------------|--------------------------------------------------|
| Frontend   | React (Vite), CSS Modules                        |
| Backend    | Node.js, Express                                 |
| Database   | MySQL                                            |
| Packages   | multer, mysql2, body-parser, cors, emoji-picker-react, @hello-pangea/dnd, nodemon, react-router-dom, axios |

---

## ⚙️ How to Access

### Live Demo (if applicable)
> [Insert Live URL here]

### Running Locally

#### 1. Set up the Backend (API)

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

#### 2. Set up the Frontend

```bash
cd ../web
npm install
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---

### Testing with Demo User

You can log in with the following demo credentials:

- **Email**: `demo@example.com`
- **Password**: `demo1234`

Alternatively, you can register your own account to test the app.

---

## 🔗 Notes for Instructor

😢😢😢😢😢😢😢 Thank you for reviewing this project. It is still a work in progress, and some features are incomplete. Your understanding is appreciated.😢😢😢😢😢😢😢