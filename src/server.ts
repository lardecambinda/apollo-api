import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import router from "./routes/router";
import { logger, errorHandler } from "./middleware/logger";
import { PrismaClient } from "@prisma/client";

const port = process.env.PORT || 3333
const app = express()
const prisma = new PrismaClient()

prisma.$connect()
  .then(() => console.log('\x1b[32m[DB] Connected to database\x1b[0m'))
  .catch((err) => console.error('\x1b[31m[DB] Failed to connect to database:\x1b[0m', err))

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger)
app.use(router)
app.use(errorHandler)

process.on('uncaughtException', (err) => {
  console.error('\x1b[31m[UNCAUGHT EXCEPTION]\x1b[0m', err)
})

process.on('unhandledRejection', (reason) => {
  console.error('\x1b[31m[UNHANDLED REJECTION]\x1b[0m', reason)
})

app.listen(port, () => console.log(`⚡️[server]: Server is running at ${port}`))
