import Joi from "joi";

const UserLoginSchema = Joi.object({
	email: Joi.string().email(),
	password: Joi.string().min(8).max(128).required(),
	phoneNumber: Joi.string().pattern(/^\d{10,15}$/),
});

export default UserLoginSchema;
