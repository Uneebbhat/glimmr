import mongoose, { Document, Schema, Types } from "mongoose";

enum OTPType {
	user = "user",
	shop = "shop",
}

interface IVerifyOTP extends Document {
	userId: Types.ObjectId;
	otp: string;
	otpType: OTPType;
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
	},
	otpType: {
		type: String,
		enum: Object.values(OTPType),
		default: OTPType.user,
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
