import Joi from "joi";

const ShopSignupSchema = Joi.object({
	shopProfileImage: Joi.string().uri(),
	ownerName: Joi.string().min(3).required(),
	shopName: Joi.string().min(3).required(),
	shopEmail: Joi.string().email().required(),
	shopPhoneNumber: Joi.string()
		.pattern(/^\d{10,15}$/)
		.required(),
	password: Joi.string().min(8).max(128).required(),
	location: Joi.object({
		shopAddress: Joi.string().required(),
		shopCity: Joi.string().required(),
		cityArea: Joi.string().required(),
	}).required(),
	verified: Joi.boolean().default(false),
});

export default ShopSignupSchema;
