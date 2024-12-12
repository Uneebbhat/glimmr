import mongoose, { Schema } from "mongoose";
import { IVerifyOTP } from "../shared/interfaces/OtpInterface";

export enum OTPType {
	user = "user",
	shop = "shop",
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
