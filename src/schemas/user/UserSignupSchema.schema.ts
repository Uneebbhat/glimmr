import Joi from "joi";
import { DEFAULT_IMG } from "../../config/constants";

const UserSignupSchema = Joi.object({
	profilePic: Joi.string().uri().default(DEFAULT_IMG),
	name: Joi.string().min(3).max(50).required(),
	email: Joi.string().email().required(),
	phoneNumber: Joi.string()
		.pattern(/^\d{10,15}$/)
		.required(),
	password: Joi.string().min(8).max(128).required(),
	verified: Joi.boolean().default(false),
});

export default UserSignupSchema;
