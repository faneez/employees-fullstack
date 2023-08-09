class CustomError extends Error {
	constructor(status, ...params) {
		super(...params)

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CustomError)
		}
		this.status = status
	}
}

export default CustomError
