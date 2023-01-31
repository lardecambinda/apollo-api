import bodyParser from "body-parser";
import express from "express";
import router from "./routes/router";

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(router)

app.listen(3001, () => console.log(`⚡️[server]: Server is running at https://localhost:3001`))