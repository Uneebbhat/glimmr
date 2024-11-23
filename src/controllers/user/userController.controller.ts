import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../utils/ResponseHandler";
import ErrorHandler from "../../utils/ErrorHandler";
import UserSignupSchema from "../../schemas/user/UserSignupSchema.schema";
import User from "../../models/user/User.model";
import bcrypt from "bcrypt";
import generateToken from "../../helpers/generateToken";
import UserDTO from "../../dto/UserDTO.dto";
import UserLoginSchema from "../../schemas/user/UserLoginSchema.schema";
import sendEmail from "../../utils/sendEmail";
import generateOTP from "../../helpers/generateOTP";
import verifySentOTP from "../../helpers/verifySentOTP";

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = UserSignupSchema.validate(req.body);
	if (error) {
		return next(error);
	}
	const { name, email, phoneNumber, password } = req.body;
	try {
		const existingUser = await User.findOne({
			$or: [{ email }, { phoneNumber }],
		});
		if (existingUser) {
			return ErrorHandler.send(
				res,
				400,
				"Email or phone number already in use",
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({
			name,
			email,
			phoneNumber,
			password: hashedPassword,
		});

		try {
			const otpValue = Math.floor(Math.random() * 9000) + 1000;
			console.log(otpValue);
			await verifySentOTP({
				userId: newUser._id!.toString(),
				otp: otpValue,
				otpType: "user",
				expiresAt: Date.now() + 600000,
			});

			await sendEmail(
				email,
				"Your OTP Verification Code for Account Setup",
				"Please use the OTP code in the app to create your account.",
				`
				<p>Dear ${name},</p>
				<p>Thank you for signing up! Please use the OTP code below to complete your account creation. This code is valid for 5 minutes:</p>
				<h2 style="color: #4CAF50;">${generateOTP}</h2>
				<p>If you did not initiate this request, please ignore this email.</p>
				<p>Best regards,<br>Glimmr Team</p>
				`,
			);
		} catch (otpError) {
			await User.findByIdAndDelete(newUser._id);
			return ErrorHandler.send(
				res,
				500,
				"Failed to set up OTP verification. Please try again.",
			);
		}

		const token = generateToken(
			{
				_id: newUser._id!.toString(),
				name: newUser.name,
				email: newUser.email,
			},
			res,
		);

		const userDTO = new UserDTO(newUser);
		ResponseHandler.send(
			res,
			201,
			"Account created successfully",
			userDTO,
			token,
		);
	} catch (error: any) {
		return ErrorHandler.send(
			res,
			500,
			`Internal Server Error ${error.message}`,
		);
	}
};

export const login = async (req: Request, res: Response) => {
	const { error } = UserLoginSchema.validate(req.body);
	if (error) {
		return ErrorHandler.send(res, 400, error.details[0].message);
	}

	const { email, phoneNumber, password } = req.body;
	try {
		const existingUser = await User.findOne({
			$or: [{ email }, { phoneNumber }],
		});
		if (!existingUser) {
			return ErrorHandler.send(
				res,
				401,
				"User not found with this email or phone number",
			);
		}

		const decryptPassword = await bcrypt.compare(
			password,
			existingUser?.password ?? "",
		);
		if (!decryptPassword) {
			return ErrorHandler.send(res, 400, "Invalid credentials");
		}
		const token = generateToken(
			{
				_id: existingUser?._id!.toString(),
				name: existingUser?.name ?? "",
				email: existingUser?.email ?? "",
			},
			res,
		);
		ResponseHandler.send(
			res,
			200,
			"Login successfully",
			existingUser ? new UserDTO(existingUser) : undefined,
			token,
		);
	} catch (error: any) {
		return ErrorHandler.send(
			res,
			500,
			`Internal Server Error ${error.message}`,
		);
	}
};

export const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		if (!email) {
			return ErrorHandler.send(res, 400, "Please provide your email address");
		}

		const user = await User.findOne({ email });
		if (!user) {
			return ErrorHandler.send(res, 404, "User not found with this email");
		}

		try {
			const otpValue = Math.floor(Math.random() * 9000) + 1000;
			console.log(otpValue);
			await verifySentOTP({
				userId: user._id!.toString(),
				otp: otpValue,
				otpType: "user",
				expiresAt: Date.now() + 600000, // OTP valid for 10 minutes
			});

			await sendEmail(
				email,
				"Reset Your Password - OTP Verification Code",
				"Please use the OTP code in the app to reset your password.",
				`
				<p>Dear ${user.name},</p>
				<p>We received a request to reset your password. Please use the OTP code below to proceed with resetting your password. This code is valid for 10 minutes:</p>
				<h2 style="color: #4CAF50;">${otpValue}</h2>
				<p>If you did not request a password reset, please disregard this email.</p>
				<p>Best regards,<br>Glimmr Team</p>
				`,
			);

			ResponseHandler.send(res, 200, "OTP sent to your email");
		} catch (otpError) {
			await User.findByIdAndDelete(user._id);
			return ErrorHandler.send(
				res,
				500,
				"Failed to set up OTP verification. Please try again.",
			);
		}
	} catch (error: any) {
		return ErrorHandler.send(
			res,
			500,
			`Internal Server Error ${error.message}`,
		);
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	const { password, userId } = req.body;

	try {
		if (!password || !userId) {
			return ErrorHandler.send(
				res,
				400,
				"Please provide a new password and user ID",
			);
		}

		const user = await User.findOne({ _id: userId });
		if (!user) {
			return ErrorHandler.send(res, 404, "User not found");
		}

		user.password = await bcrypt.hash(password, 10);
		await user.save();

		ResponseHandler.send(res, 200, "Password updated successfully");
	} catch (error: any) {
		return ErrorHandler.send(
			res,
			500,
			`Internal Server Error ${error.message}`,
		);
	}
};
