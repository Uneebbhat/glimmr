import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
}

const userModel = new Schema<IUser>(
	{
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
	},
	{ timestamps: true },
);

const User = mongoose.model<IUser>("User", userModel);

export default User;
