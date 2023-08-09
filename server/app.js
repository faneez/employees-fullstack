import express from "express"
import path from "path"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
import authRouter from "./routes/auth.router.js"
import employeesRouter from "./routes/employee.router.js"

dotenv.config()
const app = express()

const port = process.env.PORT || "3000"

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/employees", employeesRouter)

app.listen(port, () => {
	console.log("Server started on PORT ", port)
})
