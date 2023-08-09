import prisma from "../prisma/prisma-client.js"
import bcrypt from "bcrypt"
import TokenService from "./token.service.js"
import CustomError from "../custom/CustomError.js"

class UserService {
	async createUser(email, password, name, activationToken) {
		const candidate = await prisma.user.findFirst({
			where: {
				email,
			},
		})

		if (candidate) {
			throw new CustomError(
				400,
				"Пользователь с таким почтовым адресом уже существует"
			)
		}

		const hashedPassword = await bcrypt.hash(password, 7)

		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
				activationToken,
				isActivated: false,
			},
		})

		const accessToken = TokenService.generateAccessToken({ id: user.id })
		const refreshToken = TokenService.generateRefreshToken({ id: user.id })

		return { user, accessToken, refreshToken }
	}

	async login(email, password) {
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		})

		if (!user) {
			throw new CustomError(400, "Пользователя с таким email не существует")
		}

		const validatePassword = await bcrypt.compare(password, user.password)
		if (!validatePassword) {
			throw new CustomError(400, "Не правильный пароль, попробуйте еще раз")
		}

		const accessToken = TokenService.generateAccessToken({ id: user.id })
		const refreshToken = TokenService.generateRefreshToken({ id: user.id })

		return { user, accessToken, refreshToken }
	}

	async findUserById(id) {
		return prisma.user.findFirst({
			where: {
				id,
			},
		})
	}

	async generateAccessToken(token) {
		if (!token) {
			throw new CustomError(400, "Авторизуйтесь")
		}

		const decoded = TokenService.decodeRefreshJWT(token)
		if (!decoded) {
			throw new CustomError(400, "Авторизуйтесь")
		}

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!user) {
			throw new CustomError(400, "Пожалуйста, авторизуйтесь повторно")
		}

		const accessToken = TokenService.generateAccessToken({ id: user.id })

		return { user, accessToken }
	}

	async activate(activationToken) {
		const user = await prisma.user.findFirst({
			where: {
				activationToken,
			},
		})

		if (!user) {
			throw new CustomError(400, "Неккоректная ссылка активации")
		}
		const activatedUser = await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				isActivated: true,
			},
		})

		return activatedUser
	}
}

export default new UserService()
