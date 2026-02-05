# How2split

A minimal online expense-splitting tool. No app download, no sign-up—create an event, share the link, and start splitting bills right away.

Inspired by the simplicity of When2meet, How2split keeps only the core features so sharing costs with friends or roommates stays quick and easy.

---

## Features

- **No account required** — Use the app by creating an event and saving or sharing its link.
- **Events** — Create an event, add participant names, and optionally lock it with a password.
- **Transactions** — Log expenses (who paid, amount, how to split), then view and edit entries.
- **Share by link** — Anyone with the event URL can view and add entries (unless the event is locked).

---

## Tech Stack

| Part      | Stack |
|-----------|--------|
| Frontend  | React 18, React Router, Ant Design |
| Backend   | Node.js, Express |
| Database  | MongoDB (Mongoose) |
| Hosting   | Frontend: Netlify; Backend: Google App Engine (or e.g. Railway) |

---

## Project Structure

```
How2split/
├── backend/           # Express API
│   ├── server.js     # Routes and MongoDB models
│   ├── app.yaml      # Google App Engine config
│   └── package.json
├── frontend/         # Create React App
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── Components/   # AddEntry, EditEntry, EditEvent, EditTrans, Header, etc.
│   │   └── Containers/   # Create, Event, About, Error
│   └── package.json
├── .nvmrc             # Node version (22)
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 20 (recommended: 22; use `.nvmrc` with `nvm use` if you use nvm).
- **MongoDB** — A MongoDB instance (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)) for the backend.

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/derekdylu/How2split.git
cd How2split
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` in `backend/`:

```env
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
PORT=8000
```

Start the server:

```bash
npm start
```

The API runs at `http://localhost:8000`.

### 3. Frontend

In a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` in `frontend/`:

```env
REACT_APP_SERVER_URL=http://localhost:8000
```

Start the dev server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Overview

Base URL (local): `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/` | Health check |
| GET    | `/events/:id` | Get one event |
| POST   | `/events` | Create event (body: `name`, `accounts[]`, optional `locked`, `password`) |
| PATCH  | `/events/:id` | Update event |
| GET    | `/events/:eventId/transactions` | List transactions for an event |
| GET    | `/transactions/:id` | Get one transaction |
| POST   | `/transactions` | Create transaction |
| PATCH  | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

---

## Deployment

### Backend (e.g. Google App Engine)

- Set `MONGO_URL` and (if needed) `PORT` in the App Engine environment.
- From the project root:  
  `cd backend && gcloud app deploy`  
  (assumes `gcloud` is installed and the project is configured.)

`app.yaml` uses `runtime: nodejs22`.

### Frontend (e.g. Netlify)

- Set env var: `REACT_APP_SERVER_URL=https://your-backend-url`
- Build command: `npm run build`
- Publish directory: `build`

The repo includes `public/_redirects` for client-side routing (`/* /index.html 200`).

---

## Feedback & Support

- **Feedback:** [Submit via this form](https://forms.gle/sXuG5QWCHrvB9G628).
- **Support the project:** [Buy Me A Coffee](https://www.buymeacoffee.com/derekdylu).

---

## Author

Designed and developed by **derekdylu**.
