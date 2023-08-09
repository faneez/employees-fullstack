import nodemailer from "nodemailer"
class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: "yuzhakov1010@gmail.com",
				pass: "lzumismzqbpbrjuf",
			},
		})
	}
	async sendActivationMail(to, link) {
		await this.transporter.sendMail({
			from: "yuzhakov1010@gmail.com",
			to,
			subject: `Активация аккаунта на ${process.env.API_URL}`,
			text: "",
			html: `
        <div> 
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
		})
	}
}

export default new MailService()
