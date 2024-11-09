import mongoose, { Schema, Document } from "mongoose";
import { DEFAULT_IMG } from "../../config/constants";

interface IUser extends Document {
	profilePic: string;
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
	verified: boolean;
}

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
