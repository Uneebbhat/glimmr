import VerifyOTP from "../models/VerifyOTP.model";
import Shop from "../models/shop/Shop.model";
import { Request, Response } from "express";
import ResponseHandler from "../utils/ResponseHandler";
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user/User.model";
// import generateOTP from "../helpers/generateOTP";

export const verifyOTP = async (req: Request, res: Response) => {
	const { otp } = req.body;

	try {
		const findOTP = await VerifyOTP.findOne({
			otp,
			$or: [{ otpType: "user" }, { otpType: "shop" }],
		});

		if (!findOTP) {
			return ErrorHandler.send(res, 404, "Invalid OTP");
		}

		if (findOTP.expiresAt < new Date()) {
			ErrorHandler.send(res, 400, "OTP has expired");
			await findOTP.deleteOne();
			return;
		}

		if (findOTP.otpType === "user") {
			const user = await User.findById(findOTP.userId);
			if (!user) {
				return ErrorHandler.send(res, 404, "User not found");
			}
			user.verified = true;
			await user.save();
		} else {
			const findOtp = await VerifyOTP.findOne({ otp, otpType: "shop" });
			const shop = await Shop.findById({ _id: findOtp?.userId });
			if (!shop) {
				return ErrorHandler.send(res, 404, "Shop not found");
			}

			shop.verified = true;
			await shop.save();
		}

		ResponseHandler.send(res, 200, "OTP verified successfully");
		await findOTP.deleteOne();
	} catch (err: any) {
		return ErrorHandler.send(res, 500, "Internal Server Error");
	}
};

export const generateNewOTP = async (req: Request, res: Response) => {
	const { userId } = req.body;

	try {
		const findOtp = await VerifyOTP.findOne({
			$or: [{ otpType: "user" }, { otpType: "shop" }],
		});

		if (findOtp?.otpType === "user") {
			const user = await User.findOne({ _id: userId });
			if (!user) {
				return ErrorHandler.send(res, 404, "User not found");
			}

			const newOTP = Math.floor(Math.random() * 9000) + 1000;

			const generateNewOTP = await VerifyOTP.create({
				userId: user._id,
				otp: newOTP,
				otpType: "user",
				createdAt: Date.now(),
				expiresAt: new Date(Date.now() + 5 * 60 * 1000),
			});
			if (generateNewOTP.expiresAt < new Date()) {
				ErrorHandler.send(res, 400, "OTP has expired");
				await generateNewOTP.deleteOne();
				return;
			}
		} else {
			const shop = await Shop.findOne({ _id: userId });
			if (!shop) {
				return ErrorHandler.send(res, 404, "Shop not found");
			}

			const newOTP = Math.floor(Math.random() * 9000) + 1000;

			const generateNewOTP = await VerifyOTP.create({
				userId: shop._id,
				otp: newOTP,
				otpType: "shop",
				createdAt: Date.now(),
				expiresAt: new Date(Date.now() + 5 * 60 * 1000),
			});
			if (generateNewOTP.expiresAt < new Date()) {
				ErrorHandler.send(res, 400, "OTP has expired");
				await generateNewOTP.deleteOne();
				return;
			}
		}

		ResponseHandler.send(res, 201, "OTP created", generateNewOTP);
	} catch (err: any) {
		console.error("Error generating OTP:", err);
		return ErrorHandler.send(res, 500, "Internal Server Error");
	}
};
