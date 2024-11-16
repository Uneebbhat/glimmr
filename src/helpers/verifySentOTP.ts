import VerifyOTP from "../models/VerifyOTP.model";
import generateOTP from "./generateOTP";

interface VerifyOTPPROPS {
	_id?: string | any;
	userId: string | any;
	otp: string | number;
	expiresAt: Date | number;
	otpType: string;
}

const verifySentOTP = async (user: VerifyOTPPROPS) => {
	const newOTP = new VerifyOTP({
		userId: user.userId,
		otp: user.otp,
		otpType: user.otpType,
		expiresAt: new Date(Date.now() + 600000),
	});
	await newOTP.save();
};

export default verifySentOTP;
