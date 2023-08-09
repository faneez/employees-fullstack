import express from "express"
import { auth } from "../middleware/auth.middleware.js"

import authController from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/login", authController.login)
router.post("/register", authController.register)
router.get("/current", auth, authController.current)
router.get("/logout", authController.logout)
router.get("/refresh", authController.refreshToken)
router.get("/activate/:activationToken", authController.activate)

export default router
