import VerifyOTP from "../models/VerifyOTP.model";
import generateOTP from "./generateOTP";

interface VerifyOTPPROPS {
	_id?: string | any;
	userId: string | any;
	otp: string | number;
	expiresAt: Date | number;
}

const verifySentOTP = async (user: VerifyOTPPROPS) => {
	const otpValue = generateOTP;
	const newOTP = new VerifyOTP({
		userId: user.userId,
		otp: otpValue,
		expiresAt: new Date(Date.now() + 600000),
	});
	await newOTP.save();
};

export default verifySentOTP;
