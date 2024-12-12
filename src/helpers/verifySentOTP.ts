import VerifyOTP from "../models/VerifyOTP.model";
import { VerifyOTPPROPS } from "../shared/interfaces/OtpInterface";
// import generateOTP from "./generateOTP";

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
