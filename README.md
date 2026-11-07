# Obsa Tesfaye Demesa — Personal Portfolio

> A production-ready MERN stack portfolio with dark/light themes, AI chat widget, admin dashboard, and full REST API.

**Live:** https://obsa-portfolio.vercel.app &nbsp;|&nbsp; **API:** https://portfolio-api.onrender.com

---

## Features

- 🌗 Dark / Light mode + 4 accent colours (blue, green, purple, orange) — saved to `localStorage`, no flash on load
- 🤖 Floating AI chat widget backed by Gemini / Claude — API key stays on the server
- 📁 8 projects with filter tabs (All / Full-Stack / Frontend / Design) and a detail modal
- 📬 Contact form → saved to MongoDB + emailed to owner via Nodemailer
- 🔐 JWT-protected admin dashboard — manage projects, skills, messages, view stats
- 📊 CV download counter tracked in MongoDB
- 📱 Mobile-first, fully responsive, accessible (ARIA labels, keyboard nav, focus states)
- ⚡ Code-split chunks, lazy-loaded images, Lighthouse target 90+
- 🗺️ SEO meta tags, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`

---

## Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Client   | React 18, Vite, React Router 6, Tailwind CSS 3, Framer Motion, Axios |
| Server   | Node.js, Express, Mongoose, JWT, Bcrypt, Nodemailer |
| Database | MongoDB Atlas |
| AI       | Google Gemini (`gemini-1.5-flash`) or Anthropic Claude |
| Deploy   | Vercel (client) · Render (server) · MongoDB Atlas (database) |

---

## Project Structure

```
portfolio/
├── client/                      # React + Vite frontend
│   ├── public/
│   │   ├── images/profile.jpg   ← ADD: your profile photo
│   │   ├── images/projects/     ← ADD: project screenshots
│   │   ├── Obsa_Tesfaye_CV.pdf  ← ADD: your CV
│   │   ├── favicon.svg
│   │   ├── sitemap.xml
│   │   └── robots.txt
│   └── src/
│       ├── components/
│       │   ├── layout/          Navbar, Footer, Layout
│       │   ├── sections/        Hero, About, Experience, Skills,
│       │   │                    Projects, Services, Testimonials, Contact
│       │   └── ui/              ThemeSwitcher, ChatWidget, SkeletonCard,
│       │                        SectionHeader, SectionWrapper
│       ├── context/             ThemeContext, AuthContext
│       ├── hooks/               useActiveSection, useScrollLock
│       ├── pages/               Home, NotFound, admin/Login, admin/Dashboard
│       ├── services/            api.js, portfolioService.js
│       ├── data/                fallback.json (offline static data)
│       └── utils/               animations.js
└── server/                      # Express API
    ├── config/                  db.js
    ├── controllers/             project, experience, skill, contact, auth, stats
    ├── data/                    portfolio.json (seed source)
    ├── middleware/               auth, errorHandler, validate
    ├── models/                  Project, Experience, Skill, Message, Admin, Stats
    ├── routes/                  projects, experience, skills, contact, auth, cv, admin, chat
    ├── scripts/                 seed.js
    └── utils/                   email.js, ai.js
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone
```bash
git clone https://github.com/obsinan7986/portfolio.git
cd portfolio
```

### 2. Environment variables

**Server** — copy and fill in:
```bash
cp server/.env.example server/.env
```

**Client** — copy and fill in:
```bash
cp client/.env.example client/.env
```

### 3. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 4. Seed the database
```bash
cd server && npm run seed
```

### 5. Run (two terminals)
```bash
# Terminal 1 — API on :5000
cd server && npm run dev

# Terminal 2 — React on :5173
cd client && npm run dev
```

Open http://localhost:5173

---

## Environment Variables

### `server/.env`

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Express port (default 5000) | No |
| `NODE_ENV` | `development` or `production` | No |
| `MONGODB_URI` | MongoDB Atlas connection string | **Yes** |
| `JWT_SECRET` | Long random string for signing JWTs | **Yes** |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` | No |
| `ADMIN_EMAIL` | Admin login email | **Yes** |
| `ADMIN_PASSWORD` | Admin login password (min 8 chars) | **Yes** |
| `EMAIL_HOST` | SMTP host e.g. `smtp.gmail.com` | Yes (contact form) |
| `EMAIL_PORT` | SMTP port e.g. `587` | No |
| `EMAIL_USER` | Sender Gmail address | Yes (contact form) |
| `EMAIL_PASS` | Gmail App Password (16 chars) | Yes (contact form) |
| `EMAIL_TO` | Where to receive contact messages | Yes (contact form) |
| `AI_PROVIDER` | `gemini` or `claude` | Yes (AI chat) |
| `AI_API_KEY` | API key for your AI provider | Yes (AI chat) |
| `AI_MODEL` | Model name e.g. `gemini-1.5-flash` | No |
| `CLIENT_URL` | Frontend origin for CORS | **Yes** in production |

### `client/.env`

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (e.g. `https://portfolio-api.onrender.com/api`) |
| `VITE_SITE_URL` | Your deployed frontend URL |

---

## Deployment

### MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. **Database Access** → Add user `portifolio` with password
3. **Network Access** → Add `0.0.0.0/0`
4. Copy the connection string to `MONGODB_URI` in server `.env`
5. Run `npm run seed` once to populate data

### Backend → Render
1. Push code to GitHub
2. Go to https://render.com → **New Web Service** → connect your repo
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add all environment variables from the table above
7. Copy the Render URL (e.g. `https://portfolio-api.onrender.com`) → set as `CLIENT_URL` in Render and `VITE_API_URL` in Vercel

### Frontend → Vercel
1. Go to https://vercel.com → **Add New Project** → import your repo
2. Set **Root Directory** to `client`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Add environment variables:
   - `VITE_API_URL` = `https://your-render-app.onrender.com/api`
   - `VITE_SITE_URL` = `https://your-vercel-app.vercel.app`
6. Deploy — Vercel auto-deploys on every push to `main`

> **Note:** After deploying, go back to Render and set `CLIENT_URL` to your Vercel URL to lock CORS.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Server health check |
| GET | `/api/projects` | — | List all projects |
| GET | `/api/projects/:slug` | — | Single project |
| GET | `/api/experience` | — | Work experience |
| GET | `/api/skills` | — | Skills grouped by category |
| POST | `/api/contact` | — | Submit contact form |
| POST | `/api/cv-download` | — | Track CV download |
| POST | `/api/chat` | — | AI chat (rate limited) |
| POST | `/api/auth/login` | — | Admin login → JWT |
| GET | `/api/auth/me` | JWT | Current admin |
| GET | `/api/admin/messages` | JWT | All contact messages |
| GET | `/api/admin/stats` | JWT | CV/contact/chat counts |
| POST/PUT/DELETE | `/api/admin/projects` | JWT | Manage projects |
| POST/PUT/DELETE | `/api/admin/experience` | JWT | Manage experience |
| POST/PUT/DELETE | `/api/admin/skills` | JWT | Manage skills |

---

## Manual Checklist

See end of README.

---

*Built with React, Node.js, Express and MongoDB by Obsa Tesfaye Demesa*
