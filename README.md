# 🚗 AutoBook Backend

AutoBook is a **vehicle service center management system backend** built using **Node.js, Express, Prisma, and MySQL**, fully containerized using Docker.

This project is designed for **real-world scalability**, **clean architecture**, and **production-ready practices**.

---

## 🚀 Features

- 🔐 JWT Authentication (Access & Refresh Tokens)
- 👥 Role-Based Access Control (Admin, Staff, Customer)
- 🚘 Vehicle service booking system
- 📡 Real-time updates using Socket.io
- ✅ Input validation using Zod & express-validator
- 🛡️ Rate limiting for API protection
- 📧 Email notifications using Nodemailer
- 🔑 Google Authentication support
- 🗄️ Prisma ORM with MySQL database
- 🐳 Fully Dockerized backend & database

---

## 🧱 Tech Stack

| Layer        | Technology |
|-------------|----------|
| Runtime      | Node.js |
| Framework    | Express |
| ORM          | Prisma |
| Database     | MySQL |
| Auth         | JWT, Google OAuth |
| Real-time    | Socket.io |
| Validation   | Zod, express-validator |
| Security     | bcrypt, express-rate-limit |
| Email        | Nodemailer |
| Container    | Docker, Docker Compose |

---

## 📁 Project Structure
backend/
├── prisma/ # Prisma schema & migrations
│ └── schema.prisma
├── src/
│ ├── controllers/ # Route controllers
│ ├── services/ # Business logic
│ ├── routes/ # API routes
│ ├── middlewares/ # Auth, validation, etc.
│ ├── config/ # DB, socket, email config
│ ├── utils/ # Helper functions
│ └── app.js / server.js
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md


---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://root:wmhmw@mysql:3306/autobook"

PORT=5000

JWT_ACCESS_SECRET="k8vB3s9xLq2rZy7aWnQeF5jGm2tVbXhD"
JWT_REFRESH_SECRET="Hf8mT3bYwP1zQe6kNrXvS2cLjD4gZsRk"

ACCESS_TOKEN_EXPIRE="15m"
REFRESH_TOKEN_EXPIRE="7d"

GOOGLE_CLIENT_ID="your_google_client_id"

EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Push schema to database (development only)
npx prisma db push

📦 Key Dependencies
express → API framework
prisma → database ORM
@prisma/client → database client
bcrypt / bcryptjs → password hashing
jsonwebtoken → authentication
socket.io → real-time communication
nodemailer → email service
zod → validation
express-validator → validation
express-rate-limit → security
cors → cross-origin requests
dotenv → environment variables

✅ CI/CD pipeline using GitHub Actions
✅ Swagger API documentation
✅ Unit testing with Jest
✅ Logging system (Winston / Pino)
✅ Deployment on AWS / VPS
✅ Frontend integration (Next.js / React)