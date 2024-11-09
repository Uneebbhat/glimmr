import Joi from "joi";

const UserSchema = Joi.object({
	name: Joi.string().min(3).max(50).required(),
	email: Joi.string().email().required(),
	phoneNumber: Joi.string()
		.pattern(/^\d{10,15}$/)
		.required(),
	password: Joi.string().min(8).max(128).required(),
});

export default UserSchema;
