import express, { json, urlencoded } from "express";
import router from "./routes/router";

const app = express()

app.use(router)
app.use(urlencoded())
app.use(json())

app.listen(3001, () => console.log(`⚡️[server]: Server is running at https://localhost:3001`))