import CustomError from "../custom/CustomError.js"
import employeeService from "../services/employee.service.js"

class EmployeeController {
	async getAll(req, res) {
		try {
			const employees = await employeeService.getEmployees()
			return res.status(201).json(employees)
		} catch (err) {
			return res.status(500).json({ message: err.message })
		}
	}

	async getOne(req, res) {
		try {
			const id = req.params.id
			const employee = await employeeService.getEmployee(id)

			return res.status(201).json(employee)
		} catch (err) {
			if (err instanceof CustomError) {
				return res.status(err.status).json({ message: err.message })
			} else {
				return res.status(500).json({ message: err.message })
			}
		}
	}
	async createEmployee(req, res) {
		try {
			const data = req.body

			if (!data.firstName || !data.lastName || !data.address || !data.age) {
				return res.status(400).json({ message: "Все поля обязательные" })
			}

			const employee = await employeeService.createEmployee(req.user.id, data)

			return res.status(201).json(employee)
		} catch (err) {
			return res.status(500).json({ message: err.message })
		}
	}

	async update(req, res) {
		try {
			const data = req.body
			const id = req.params.id
			const updatedEmployee = await employeeService.updateEmployee(id, data)
			return res.status(200).json(updatedEmployee)
		} catch (err) {
			if (err instanceof CustomError) {
				return res.status(err.status).json({ message: err.message })
			} else {
				return res.status(500).json({ message: err.message })
			}
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			await employeeService.deleteEmployee(id)

			return res.status(200).json({ message: "Сотрудник был удален" })
		} catch (err) {
			if (err instanceof CustomError) {
				return res.status(err.status).json({ message: err.message })
			} else {
				return res.status(500).json({ message: err.message })
			}
		}
	}
}

export default new EmployeeController()
