import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import employeeController from "../controllers/employee.controller.js"

const router = express.Router()

router.get("/", auth, employeeController.getAll)
router.get("/:id", auth, employeeController.getOne)
router.post("/", auth, employeeController.createEmployee)
router.delete("/:id", auth, employeeController.delete)
router.put("/:id", auth, employeeController.update)

export default router
