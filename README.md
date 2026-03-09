# Online Voting System

This project is an online voting system with a frontend and backend.

Online Voting System (Backend-Focused Project)
Secure polling platform exposing role-based APIs for poll lifecycle management, vote collection, and result distribution.

• Designed a modular REST API architecture (auth, polls, votes) with clear service boundaries, enabling independent evolution of authentication, poll management, and voting workflows.
• Implemented layered authentication and authorization using JWT-protected admin endpoints, email/OTP verification, and allowlist-based access controls for private polls to enforce least-privilege access.
• Built integration-driven backend workflows by combining transactional PostgreSQL operations (Prisma ORM), email delivery, Google reCAPTCHA validation, and asynchronous Redis/Bull job processing for scheduled result notifications.
• Applied reliability and anti-abuse controls including uniqueness constraints, idempotency checks (email/IP vote guards), OTP expiry windows, retry/backoff queue policies, and centralized error handling for safer API behavior.

Tech: Node.js, TypeScript, Express.js, PostgreSQL, Prisma ORM, Redis, Bull Queue, JWT, Nodemailer, reCAPTCHA

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm run dev
```

#### Make sure you create environment variables:

DATABASE_URL: "your pg db link"

JWT_SECRET: "this can be anything"
