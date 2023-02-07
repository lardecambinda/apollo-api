import 'dotenv/config'
import bodyParser from "body-parser";
import express from "express";
import router from "./routes/router";

const port = process.env.PORT
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(router)

app.listen(port, () => console.log(`⚡️[server]: Server is running at https://localhost:${port}`))