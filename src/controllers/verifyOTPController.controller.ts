import VerifyOTP from "../models/VerifyOTP.model";
import Shop from "../models/shop/Shop.model";
import { Request, Response } from "express";
import ResponseHandler from "../utils/ResponseHandler";
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user/User.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants";

export const verifyOTP = async (req: Request, res: Response) => {
	const { otp, purpose } = req.body;

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

		if (purpose === "password-reset") {
			// If the OTP is for password reset
			const user = await User.findById(findOTP.userId);
			if (!user) {
				return ErrorHandler.send(res, 404, "User not found");
			}

			// Generate a temporary JWT token for password reset
			if (!JWT_SECRET) {
				return ErrorHandler.send(res, 404, "JWT secret no found");
			}
			const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
				expiresIn: "15m",
			});

			// Send the reset token to the frontend
			ResponseHandler.send(
				res,
				200,
				"OTP verified successfully for password reset",
				resetToken,
			);
		} else {
			// For normal user/shop verification
			if (findOTP.otpType === "user") {
				const user = await User.findById(findOTP.userId);
				if (!user) {
					return ErrorHandler.send(res, 404, "User not found");
				}
				user.verified = true;
				await user.save();
			} else {
				const shop = await Shop.findById(findOTP.userId);
				if (!shop) {
					return ErrorHandler.send(res, 404, "Shop not found");
				}
				shop.verified = true;
				await shop.save();
			}

			ResponseHandler.send(res, 200, "OTP verified successfully");
		}

		// Delete OTP record after successful verification
		await findOTP.deleteOne();
	} catch (error: any) {
		return ErrorHandler.send(
			res,
			500,
			`Internal Server Error ${error.message}`,
		);
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
	} catch (error: any) {
		// console.error("Error generating OTP:", error.message);
		return ErrorHandler.send(
			res,
			500,
			`Internal Server Error ${error.message}`,
		);
	}
};
