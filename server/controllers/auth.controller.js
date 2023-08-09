import userService from "../services/user.service.js"
import { v4 as uuidv4 } from "uuid"
import mailService from "../services/mail.service.js"
import CustomError from "../custom/CustomError.js"

class AuthController {
	async login(req, res) {
		try {
			const { password, email } = req.body

			if (!email || !password) {
				return res
					.status(400)
					.json({ message: "Пожалуйста, заполните обязательные поля" })
			}

			const userData = await userService.login(email, password)
			res.cookie("refreshToken", userData.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
				path: "/api/auth/refresh",
			})

			return res
				.status(200)
				.json({ user: userData.user, accessToken: userData.accessToken })
		} catch (err) {
			if (err instanceof CustomError) {
				return res.status(err.status).json({ message: err.message })
			} else {
				return res.status(500).json({ message: err.message })
			}
		}
	}

	async register(req, res) {
		try {
			const { email, password, name } = req.body

			if (!email || !password || !name) {
				return res
					.status(400)
					.json({ message: "Пожалуйста, заполните обязательные поля" })
			}

			const activationToken = uuidv4()

			const data = await userService.createUser(
				email,
				password,
				name,
				activationToken
			)

			res.cookie("refreshToken", data.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
				path: "/api/auth/refresh",
			})

			await mailService.sendActivationMail(
				email,
				`${process.env.API_URL}/api/auth/activate/${activationToken}`
			)

			return res.json({ user: data.user, accessToken: data.accessToken })
		} catch (err) {
			if (err instanceof CustomError) {
				return res.status(err.status).json({ message: err.message })
			} else {
				return res.status(500).json({ message: err.message })
			}
		}
	}

	current(req, res) {
		try {
			return res.status(400).json(req.user)
		} catch (e) {
			return res.status(500).json({ message: e.message })
		}
	}

	logout(req, res) {
		res.clearCookie("refreshToken")
		return res.status(200).json({ message: "Выполнен выход" })
	}

	async activate(req, res) {
		try {
			const { activationToken } = req.params
			await userService.activate(activationToken)
			return res.redirect(process.env.CLIENT_URL)
		} catch (err) {
			if (err instanceof CustomError) {
				return res.status(err.status).json({ message: err.message })
			} else {
				return res.status(500).json({ message: err.message })
			}
		}
	}

	async refreshToken(req, res) {
		try {
			const refreshToken = req.cookies.refreshToken
			const userData = await userService.generateAccessToken(refreshToken)

			return res.status(200).json(userData)
		} catch (err) {
			if (err instanceof CustomError) {
				return res.status(err.status).json({ message: err.message })
			} else {
				return res.status(500).json({ message: err.message })
			}
		}
	}
}

export default new AuthController()
