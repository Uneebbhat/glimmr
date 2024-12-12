import mongoose, { Schema } from "mongoose";
import { DEFAULT_IMG } from "../../config/constants";
import { IUser } from "../../shared/interfaces/UserInterface";

const userModel = new Schema<IUser>(
	{
		profilePic: {
			type: String,
			default: DEFAULT_IMG,
		},
		name: {
			type: String,
			required: true,
			minlength: 3,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const User = mongoose.model<IUser>("User", userModel);

export default User;
