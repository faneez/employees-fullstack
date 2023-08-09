import jwt from "jsonwebtoken"

class TokenService {
	generateAccessToken(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: "1h",
		})

		return accessToken
	}

	generateRefreshToken(payload) {
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
			expiresIn: "30d",
		})

		return refreshToken
	}

	decodeRefreshJWT(token) {
		const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
		return decoded
	}

	decodeAccessJWT(token) {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
		return decoded
	}

	setTokenCookie(res, token) {
		const cookieOptions = {
			httpOnly: true,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		}

		res.cookie("refreshToken", token, cookieOptions)
	}
}

export default new TokenService()
