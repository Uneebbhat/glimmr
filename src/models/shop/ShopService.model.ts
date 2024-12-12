import mongoose, { Schema } from "mongoose";
import { IShopService } from "../../shared/index";

export enum ServiceCategory {
	Haircut = "Haircut",
	Nails = "Nails",
	Facial = "Facial",
	Coloring = "Coloring",
	Spa = "Spa",
	Waxing = "Waxing",
	Makeup = "Makeup",
	Massage = "Massage",
}

const shopServiceModel = new Schema<IShopService>(
	{
		shopId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shop",
			required: true,
		},
		serviceName: {
			type: String,
			required: true,
			minlength: 3,
		},
		category: {
			type: String,
			enum: Object.values(ServiceCategory),
			default: ServiceCategory.Haircut,
		},
		serviceDescription: {
			type: String,
			required: true,
		},
		servicePrice: {
			type: Number,
			required: true,
			default: 0,
		},
		serviceDiscount: {
			type: Number,
			default: 0,
		},
		doorStepPrice: {
			type: Number,
			default: 0,
		},
		doorStepDiscount: {
			type: Number,
			default: 0,
		},
		serviceImages: {
			type: [String],
			validate: [
				(val: string[]) => val.length <= 15,
				"Maximum 15 images are allowed.",
			],
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const ShopService = mongoose.model<IShopService>(
	"ShopService",
	shopServiceModel,
);

export default ShopService;
