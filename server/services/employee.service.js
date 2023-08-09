import prisma from "../prisma/prisma-client.js"
import CustomError from "../custom/CustomError.js"
class EmployeeService {
	async createEmployee(userId, data) {
		const employee = await prisma.employee.create({
			data: {
				...data,
				userId,
			},
		})

		return employee
	}
	async getEmployees() {
		return await prisma.employee.findMany()
	}

	async getEmployee(id) {
		const employee = await prisma.employee.findUnique({
			where: {
				id,
			},
		})

		if (!employee) {
			throw new CustomError(400, "Такого сотрудника не существует")
		}

		return employee
	}

	async updateEmployee(id, data) {
		const updatedEmployee = await prisma.employee.update({
			where: {
				id,
			},
			data,
		})

		if (!updatedEmployee) {
			throw new CustomError(400, "Такого сотрудника нет")
		}

		return updatedEmployee
	}

	async deleteEmployee(id) {
		const deletedEmployee = await prisma.employee.delete({
			where: {
				id,
			},
		})

		if (!deletedEmployee) {
			throw new CustomError(400, "Такого сотрудника нет")
		}

		return deletedEmployee
	}
}

export default new EmployeeService()
