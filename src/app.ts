import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/router";
import { logger, errorHandler } from "./middleware/logger";
import { PrismaClient } from "@prisma/client";

const app = express()
const prisma = new PrismaClient()

prisma.$connect()
  .then(() => console.log('\x1b[32m[DB] Connected to database\x1b[0m'))
  .catch((err) => console.error('\x1b[31m[DB] Failed to connect to database:\x1b[0m', err))

// Security headers
app.use(helmet())

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Body parser with size limits
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(bodyParser.json({ limit: '10mb' }))

app.use(logger)
app.use(router)
app.use(errorHandler)

process.on('uncaughtException', (err) => {
  console.error('\x1b[31m[UNCAUGHT EXCEPTION]\x1b[0m', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('\x1b[31m[UNHANDLED REJECTION]\x1b[0m', reason)
  process.exit(1)
})

export default app
