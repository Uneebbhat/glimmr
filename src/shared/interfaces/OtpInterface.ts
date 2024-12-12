import { Types } from "mongoose";
import { OTPType } from "../../models/VerifyOTP.model";

export interface IVerifyOTP extends Document {
	userId: Types.ObjectId;
	otp: string;
	otpType: OTPType;
	createdAt: Date;
	expiresAt: Date;
}

export interface VerifyOTPPROPS {
	_id?: string | Types.ObjectId;
	userId: string | any;
	otp: string | number;
	expiresAt: Date | number;
	otpType: string;
}
