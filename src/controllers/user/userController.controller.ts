import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../utils/ResponseHandler";
import UserSignupSchema from "../../schemas/user/UserSignupSchema.schema";
import ErrorHandler from "../../utils/ErrorHandler";
import User from "../../models/user/User.model";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken";
import UserDTO from "../../dto/UserDTO.dto";
import UserLoginSchema from "../../schemas/user/UserLoginSchema.schema";
import sendEmail from "../../utils/sendEmail";
import VerifyOTP from "../../models/VerifyOTP.model";

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
		if (!newUser) {
			return ErrorHandler.send(res, 400, "An error occured");
		}

		const token = generateToken(
			{
				_id: newUser._id!.toString(),
				name: newUser.name,
				email: newUser.email,
			},
			res,
		);

		const generateOTP = Math.floor(Math.random() * 9000) + 1000;

		const verifyOTP = new VerifyOTP({
			userId: newUser._id,
			otp: generateOTP,
			expiryTime: Date.now() + 600000,
		});

		verifyOTP.save();

		await sendEmail(
			email,
			"Your OTP Verification Code for Account Setup",
			"Please use the OTP code in the app to create your account.",
			`
    <p>Dear ${name},</p>
    <p>Thank you for signing up! Please use the OTP code below to complete your account creation. This code is valid for 15 minutes:</p>
    <h2 style="color: #4CAF50;">${generateOTP}</h2>
    <p>If you did not initiate this request, please ignore this email.</p>
    <p>Best regards,<br>Glimmr Team</p>
  `,
		);

		const userDTO = new UserDTO(newUser);

		ResponseHandler.send(
			res,
			201,
			"Account created successfully",
			userDTO,
			token,
		);
	} catch (err: any) {
		return ErrorHandler.send(res, 500, "Internal Server Error");
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
	} catch (err: any) {
		return ErrorHandler.send(res, 500, "Internal Server Error");
	}
};

export const verifyOTP = async (req: Request, res: Response) => {
	const { otp } = req.body;

	try {
		const findOTP = await VerifyOTP.findOne({ otp });

		if (!findOTP) {
			return ErrorHandler.send(res, 404, "Invalid OTP");
		}

		if (findOTP.expiresAt < new Date()) {
			await findOTP.deleteOne();
			return ErrorHandler.send(res, 400, "OTP has expired");
		}

		const user = await User.findById(findOTP.userId);
		if (!user) {
			return ErrorHandler.send(res, 404, "User not found");
		}

		user.verified = true;
		await user.save();

		ResponseHandler.send(res, 200, "OTP verified successfully");
		await findOTP.deleteOne();
	} catch (err: any) {
		return ErrorHandler.send(res, 500, "Internal Server Error");
	}
};
