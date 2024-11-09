import nodemailer from "nodemailer";
import {
	NODE_HOST,
	NODE_PASS,
	NODE_PORT,
	NODE_SERVICE,
	NODE_USER,
} from "../config/constants";

const sendEmail = async (
	email: string,
	subject: string,
	text: string,
	htmlContent: string = "",
) => {
	const transporter = nodemailer.createTransport({
		service: NODE_SERVICE as string,
		auth: {
			user: NODE_USER,
			pass: NODE_PASS,
		},
	});

	const info = await transporter.sendMail({
		from: '"Your App Team" <no-reply@example.com>',
		to: email,
		subject,
		text,
		html: htmlContent || text,
	});

	// console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
