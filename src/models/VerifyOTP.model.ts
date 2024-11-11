import mongoose, { Document, Schema, Types } from "mongoose";

interface IVerifyOTP extends Document {
	userId: Types.ObjectId;
	otp: string;
	createdAt: Date;
	expiresAt: Date;
}

const verifyOTPModel = new Schema<IVerifyOTP>({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	otp: {
		type: String,
		required: true,
		minlength: 4,
		maxlength: 4,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	expiresAt: {
		type: Date,
		required: true,
		index: { expires: "5m" },
	},
});

const VerifyOTP = mongoose.model<IVerifyOTP>("VerifyOTP", verifyOTPModel);

export default VerifyOTP;
