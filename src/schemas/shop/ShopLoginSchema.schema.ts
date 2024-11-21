import Joi from "joi"

const ShopLoginSchemaSchema = Joi.object({
	shopEmail: Joi.string().email(),
	shopPhoneNumber: Joi.string()
		.pattern(/^\d{10,15}$/),
	password: Joi.string().min(8).max(128).required(),
})

export default ShopLoginSchemaSchema