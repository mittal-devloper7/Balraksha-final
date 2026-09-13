# BalRaksha Backend

Backend API for **BalRaksha**, a privacy-first child online safety platform.

BalRaksha uses a browser extension to perform AI-assisted risk detection locally on the user's device. The backend receives only a structured safety report when the user explicitly chooses **Report Safely**.

> **Privacy principle:** No report → no conversation leaves the device.

## Features

- User registration and JWT login
- Role-based access control
- Structured AI risk-report ingestion
- Report and risk-event management
- Evidence upload/retrieval
- Coordinator dashboard
- High-priority case management
- Help requests
- Real-time support chat with Socket.IO
- MySQL persistence through Sequelize
- Privacy-first separation between local chat analysis and backend reporting

## Architecture

```text
Browser Extension
  └─ Local AI/ML detection
       └─ User clicks "Report Safely"
            └─ Structured JSON
                 ↓
          Node.js + Express API
                 ↓
              Sequelize
                 ↓
             MySQL
                 ↑
          React Frontend
       Child / Coordinator Portal
```

The extension should **not automatically upload complete chat conversations**. Normal detection remains local. Only an explicit report sends structured information to the backend.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| Sequelize | ORM |
| MySQL | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File uploads |
| express-validator | Validation |
| Socket.IO | Real-time support |
| CORS | Cross-origin access |
| dotenv | Environment variables |
| Nodemon | Development |

## Project Structure

```text
balraksha-backend/
├── config/
│   └── config.js
├── controllers/
│   ├── authController.js
│   ├── reportController.js
│   ├── evidenceController.js
│   ├── coordinatorController.js
│   ├── helpController.js
│   └── threatController.js
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── migrations/
├── models/
│   ├── index.js
│   ├── user.js
│   ├── report.js
│   ├── riskEvent.js
│   ├── evidence.js
│   ├── helpRequest.js
│   └── supportMessage.js
├── routes/
│   ├── authRoutes.js
│   ├── reportRoutes.js
│   ├── evidenceRoutes.js
│   ├── coordinatorRoutes.js
│   ├── helpRoutes.js
│   └── threatRoutes.js
├── services/
│   └── threatService.js
├── uploads/
├── .env
├── .gitignore
├── app.js
├── server.js
└── package.json
```

## Installation

### Prerequisites

Install Node.js, npm, and MySQL.

Check:

```bash
node -v
npm -v
mysql --version
```

### Clone and install

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd balraksha-backend
npm install
```

If dependencies are not already present:

```bash
npm install express sequelize mysql2 cors dotenv bcryptjs jsonwebtoken multer express-validator socket.io
npm install --save-dev nodemon
```

## Environment Variables

Create `.env` in the backend root:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=balraksha_db
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

JWT_SECRET=YOUR_LONG_RANDOM_SECRET

FRONTEND_URL=http://localhost:5173
```

Never commit `.env`.

Recommended `.gitignore`:

```gitignore
node_modules/
.env
uploads/*
```

You can provide `.env.example` without secrets:

```env
PORT=5000
DB_HOST=
DB_PORT=3306
DB_NAME=balraksha_db
DB_USER=
DB_PASSWORD=
JWT_SECRET=
FRONTEND_URL=
```

## Database Setup

Create the database:

```sql
CREATE DATABASE balraksha_db;
```

Then run migrations if your project is configured for Sequelize CLI:

```bash
npx sequelize-cli db:migrate
```

Undo the latest migration:

```bash
npx sequelize-cli db:migrate:undo
```

## Run Locally

Development:

```bash
npm run dev
```

Or:

```bash
node server.js
```

Default server:

```text
http://localhost:5000
```

Test:

```text
GET http://localhost:5000/
```

## Authentication

### Register

```http
POST /api/auth/register
```

Example:

```json
{
  "name": "Test Child",
  "email": "child@example.com",
  "password": "Password@123"
}
```

New registrations are created as `CHILD`.

### Login

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "child@example.com",
  "password": "Password@123"
}
```

Use the returned JWT for protected requests:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Current user

```http
GET /api/auth/me
```

## Roles

```text
CHILD
PARENT
COORDINATOR
ADMIN
```

Coordinator/admin-only endpoints use role-based authorization.

## Threat Analysis API

The browser extension performs AI-assisted analysis locally.

When the user explicitly selects **Report Safely**, it sends a structured result to:

```http
POST /api/threat/analyze
```

Example:

```json
{
  "riskScore": 87,
  "category": "GROOMING",
  "description": "Potentially unsafe interaction involving secrecy and requests for personal content.",
  "anonymous": true,
  "signals": [
    {
      "signal": "SECRECY_REQUEST",
      "description": "The interaction contains a request to keep the conversation secret.",
      "weight": 30
    },
    {
      "signal": "PERSONAL_CONTENT_REQUEST",
      "description": "The interaction contains a request for personal visual content.",
      "weight": 35
    },
    {
      "signal": "MANIPULATIVE_BEHAVIOR",
      "description": "The interaction shows potentially manipulative behavior toward a minor.",
      "weight": 22
    }
  ]
}
```

Supported categories:

```text
GROOMING
HARASSMENT
THREAT
PERSONAL_INFORMATION
SEXUAL_CONTENT
CYBERBULLYING
OTHER
```

### Risk levels

The backend is the source of truth:

| Score | Level |
|---:|---|
| 0–39 | LOW |
| 40–69 | MEDIUM |
| 70–89 | HIGH |
| 90–100 | CRITICAL |

Example response:

```json
{
  "riskScore": 87,
  "riskLevel": "HIGH",
  "requiresImmediateAttention": false
}
```

A score of 90 or above requires immediate attention.

### Important API flow

`/api/threat/analyze` already creates the `Report` and its `RiskEvent` records.

Therefore, for an extension-generated threat, do **not** submit the same event again through:

```text
POST /api/reports
POST /api/reports/:id/risk-events
```

The intended flow is:

```text
Extension
   ↓
POST /api/threat/analyze
   ↓
Validate
   ↓
Calculate risk level
   ↓
Create Report
   ↓
Create RiskEvents
   ↓
Return result
```

## Reports API

```http
POST  /api/reports
GET   /api/reports
GET   /api/reports/:id
PATCH /api/reports/:id/status
POST  /api/reports/:id/risk-events
GET   /api/reports/:id/risk-events
```

For the normal extension report flow, prefer `/api/threat/analyze`.

## Evidence API

```http
POST /api/evidence/:id
GET  /api/evidence/:id
```

Accepted types:

```text
image/jpeg
image/png
image/webp
application/pdf
```

Maximum file size:

```text
5 MB
```

Evidence should only be uploaded when appropriate and authorized. Do not automatically upload private chat logs.

## Coordinator API

```http
GET /api/coordinator/dashboard
GET /api/coordinator/high-priority
```

These endpoints require `COORDINATOR` or `ADMIN`.

## Help & Support API

```http
POST  /api/help
GET   /api/help
GET   /api/help/:id
PATCH /api/help/:id/status
GET   /api/help/:id/messages
```

## Socket.IO

Support chat uses:

```text
join-help
send-message
new-message
```

Flow:

```text
User
 ↓
Help Request
 ↓
Coordinator
 ↓
Socket.IO
 ↓
Real-time support
```

## Database Relationships

```text
User
├── Reports
│   ├── RiskEvents
│   └── Evidence
└── HelpRequests
    └── SupportMessages
```

## Privacy Model

Normal operation:

```text
Chat
 ↓
Browser Extension
 ↓
Local AI analysis
 ↓
No backend request
```

Explicit report:

```text
Chat
 ↓
Local AI analysis
 ↓
Structured risk result
 ↓
Backend
```

The backend should receive structured fields such as:

```text
riskScore
category
description
anonymous
signals
```

It should not automatically receive complete conversation history.

## Risk-Score Disclaimer

The risk score is a **safety triage signal**.

It is not:

- proof that abuse occurred
- proof that someone is an offender
- probability of guilt
- a legal determination

Use language such as:

```text
Potentially unsafe interaction detected.
```

Do not claim:

```text
Abuser detected.
100% accurate.
```

## Extension Integration

During local development:

```javascript
const BACKEND_URL = "http://localhost:5000";
```

Send the structured report:

```javascript
fetch(`${BACKEND_URL}/api/threat/analyze`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(reportData)
});
```

For production, replace the localhost URL with the deployed HTTPS backend:

```javascript
const BACKEND_URL = "https://your-backend-domain.com";
```

The production extension must also allow the deployed backend in its `host_permissions`.

## Frontend Integration

Example Vite environment:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

Frontend uses the backend for:

- Authentication
- Reports
- Coordinator dashboard
- Help/support
- Evidence
- Settings
- Real-time support chat

The website itself should not claim to scan WhatsApp, Instagram, or Discord. Local detection is performed by the extension.

## CORS

Production CORS should allow the exact frontend origin:

```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

Configure Socket.IO CORS similarly.

Avoid unrestricted production CORS when authenticated requests are involved.

## Production Deployment

Recommended:

```text
React Frontend  → Vercel
Node/Express    → Railway
MySQL           → Railway
Extension       → Chrome Web Store / Load Unpacked
```

Recommended order:

1. Push backend to GitHub.
2. Create Railway MySQL.
3. Deploy backend to Railway.
4. Add production environment variables.
5. Run Sequelize migrations against production MySQL.
6. Test production API.
7. Deploy React frontend.
8. Set frontend API/socket environment variables.
9. Configure backend CORS.
10. Change extension backend URL from localhost to HTTPS.
11. Add production backend to extension permissions.
12. Test the complete end-to-end flow.

### Production variables

```env
PORT=5000

DB_HOST=YOUR_RAILWAY_MYSQL_HOST
DB_PORT=3306
DB_NAME=balraksha_db
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD

JWT_SECRET=YOUR_PRODUCTION_SECRET

FRONTEND_URL=https://your-frontend-domain.com
```

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Changing the production JWT secret invalidates existing tokens.

## Security Checklist

Before production:

- [ ] HTTPS enabled
- [ ] JWT secret stored only in environment variables
- [ ] Database credentials kept private
- [ ] `.env` excluded from Git
- [ ] Request validation enabled
- [ ] Upload type and size validation enabled
- [ ] Production CORS restricted
- [ ] Coordinator/admin routes protected
- [ ] Passwords hashed with bcrypt
- [ ] Raw chat messages not logged
- [ ] Unnecessary personal information not stored
- [ ] Complete conversations not automatically uploaded
- [ ] Database credentials never exposed to frontend/extension
- [ ] AI risk scores treated as triage signals

## API Quick Reference

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/threat/analyze` | Submit structured threat |
| POST | `/api/reports` | Create report |
| GET | `/api/reports` | List reports |
| GET | `/api/reports/:id` | Get report |
| PATCH | `/api/reports/:id/status` | Update report |
| POST | `/api/reports/:id/risk-events` | Add risk event |
| GET | `/api/reports/:id/risk-events` | Get risk events |
| POST | `/api/evidence/:id` | Upload evidence |
| GET | `/api/evidence/:id` | Get evidence |
| GET | `/api/coordinator/dashboard` | Coordinator dashboard |
| GET | `/api/coordinator/high-priority` | High-priority cases |
| POST | `/api/help` | Create help request |
| GET | `/api/help` | List help requests |
| GET | `/api/help/:id` | Get help request |
| PATCH | `/api/help/:id/status` | Update help status |
| GET | `/api/help/:id/messages` | Get messages |

## Testing Checklist

### Backend

- [ ] Server starts
- [ ] MySQL connection works
- [ ] Migrations succeed
- [ ] Registration works
- [ ] Login works
- [ ] JWT authentication works
- [ ] `/api/auth/me` works
- [ ] Threat analysis works
- [ ] Report is created
- [ ] Risk events are created
- [ ] Risk thresholds are correct
- [ ] Evidence upload works
- [ ] Coordinator dashboard works
- [ ] High-priority cases work
- [ ] Help requests work
- [ ] Support messages work
- [ ] Socket.IO works

### Extension

- [ ] Extension loads
- [ ] Local AI model loads
- [ ] Normal scanning does not send raw chat
- [ ] Warning works
- [ ] Report Safely works
- [ ] Backend receives structured report
- [ ] Report appears in database
- [ ] Risk events appear in database

### Frontend

- [ ] Login works
- [ ] Reports display
- [ ] Coordinator dashboard works
- [ ] Help request works
- [ ] Live chat works
- [ ] Evidence displays
- [ ] Settings work
- [ ] Learning resources work

## End-to-End Demo

```text
1. Open a supported chat website
        ↓
2. Extension performs local AI analysis
        ↓
3. Potentially unsafe interaction is detected
        ↓
4. Extension shows a safety warning
        ↓
5. User clicks "Report Safely"
        ↓
6. Extension sends structured risk data
        ↓
7. POST /api/threat/analyze
        ↓
8. Backend validates the request
        ↓
9. Report + RiskEvents are created
        ↓
10. Coordinator sees the case
        ↓
11. Coordinator reviews the risk information
        ↓
12. User can request human help
        ↓
13. Coordinator provides support through Live Chat
```

## Project Principle

> **No report → no conversation leaves the device.**

BalRaksha separates local AI detection from secure case coordination. This minimizes unnecessary collection of sensitive conversation data while allowing a user to voluntarily report a potentially unsafe interaction.

---

## License

Built for the **Bal Suraksha hackathon track**.
