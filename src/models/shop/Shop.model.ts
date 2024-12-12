import mongoose, { Schema } from "mongoose";
import { DEFAULT_SHOP } from "../../config/constants";
import { IShop } from "../../shared/interfaces/ShopInterface";

const shopModel = new Schema<IShop>(
	{
		shopProfilePic: {
			type: String,
			default: DEFAULT_SHOP,
		},
		ownerName: {
			type: String,
			required: true,
			minlength: 3,
		},
		shopName: {
			type: String,
			required: true,
			minlength: 3,
			unique: true,
		},
		shopEmail: {
			type: String,
			unique: true,
			required: true,
		},
		shopPhoneNumber: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		location: {
			shopAddress: {
				type: String,
				required: true,
			},
			shopCity: {
				type: String,
				required: true,
			},
			cityArea: {
				type: String,
				required: true,
			},
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const Shop = mongoose.model<IShop>("Shop", shopModel);

export default Shop;
