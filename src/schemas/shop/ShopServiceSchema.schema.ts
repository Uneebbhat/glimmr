import Joi from "joi";

const ServiceCategory = [
	"Haircut",
	"Nails",
	"Facial",
	"Coloring",
	"Spa",
	"Waxing",
	"Makeup",
	"Massage",
];

const ShopServiceSchema = Joi.object({
	shopId: Joi.string().required(),
	serviceName: Joi.string().min(3).required(),
	category: Joi.string()
		.valid(...ServiceCategory)
		.default("Haircut"),
	serviceDescription: Joi.string().required(),
	servicePrice: Joi.number().min(0).required(),
	serviceDiscount: Joi.number().min(0).optional().default(0),
	doorStepPrice: Joi.number().min(0).optional().default(0),
	doorStepDiscount: Joi.number().min(0).optional().default(0),
	serviceImage: Joi.string().optional().min(1).max(15),
});


export default ShopServiceSchema;
