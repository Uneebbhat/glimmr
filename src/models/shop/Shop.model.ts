import mongoose, { Schema, Document } from "mongoose";

interface IShop extends Document {
	shopProfileImage: string;
	userName: string;
	shopName: string;
	shopEmail: string;
	shopPhoneNumber: string;
	password: string;
	location: {
		shopAddress: string;
		shopCity: string;
		cityArea: string;
	};
}

const shopModel = new Schema<IShop>(
	{
		shopProfileImage: {
			type: String,
		},
		userName: {
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
	},
	{ timestamps: true },
);

const Shop = mongoose.model<IShop>("Shop", shopModel);

export default Shop;
