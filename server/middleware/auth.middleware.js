import UserService from "../services/user.service.js"
import TokenService from "./../services/token.service.js"

export const auth = async (req, res, next) => {
	try {
		const accessToken = req.headers.authorization.split(" ")[1]

		if (!accessToken) {
			return res.status(400).json({ message: "Пожалуйста, авторизуйтесь" })
		}

		const decoded = TokenService.decodeAccessJWT(accessToken)

		if (!decoded) {
			return res.status(400).json({ message: "Авторизуйтесь" })
		}

		const user = await UserService.findUserById(decoded.id)
		if (!user)
			return res.status(400).json({ message: "Пользователь не найден" })

		req.user = user
		next()
	} catch (e) {
		return res.status(500).json({ message: e.message })
	}
}
