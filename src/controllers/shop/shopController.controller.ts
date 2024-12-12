import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../utils/ResponseHandler";
import ShopSignupSchema from "../../schemas/shop/ShopSignupSchema.schema";
import ErrorHandler from "../../utils/ErrorHandler";
import Shop from "../../models/shop/Shop.model";
import bcrypt from "bcrypt";
import generateToken from "../../helpers/generateToken";
import sendEmail from "../../utils/sendEmail";
import verifySentOTP from "../../helpers/verifySentOTP";
import ShopDTO from "../../dto/ShopDTO.dto";
import ShopLoginSchemaSchema from "../../schemas/shop/ShopLoginSchema.schema";
import User from "../../models/user/User.model";

export const createShop = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = ShopSignupSchema.validate(req.body);
	if (error) {
		return next(error);
	}
	const {
		ownerName,
		shopName,
		shopEmail,
		shopPhoneNumber,
		password,
		location: { shopAddress, shopCity, cityArea },
	} = req.body;

	try {
		const existingShop = await Shop.findOne({
			$or: [{ shopEmail }, { shopName }],
		});

		if (existingShop) {
			return ErrorHandler.send(
				res,
				400,
				"Shop with this email or name already exists",
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.findOne({ email: shopEmail });
		// console.log(user);
		// console.log(shopEmail);

		if (shopEmail === user?.email) {
			return ErrorHandler.send(res, 400, "Email already in use");
		}

		const newShop = await Shop.create({
			ownerName,
			shopName,
			shopEmail,
			shopPhoneNumber,
			password: hashedPassword,
			location: { shopAddress, shopCity, cityArea },
		});

		if (!newShop) {
			return ErrorHandler.send(res, 400, "An error occurred");
		}

		try {
			// Store in database
			const otpValue = Math.floor(Math.random() * 9000) + 1000;
			// console.log(otpValue);

			await verifySentOTP({
				userId: newShop._id!.toString(),
				otp: otpValue,
				otpType: "shop",
				expiresAt: Date.now() + 600000,
			});

			await sendEmail(
				shopEmail,
				"Your OTP Verification Code for Shop Setup",
				"Please use the OTP code in the app to complete your shop setup.",
				`
	<p>Dear ${shopName},</p>
	<p>Welcome to Glimmr! We're thrilled to have you on board. To finalize your shop setup, please enter the OTP code below within the next 5 minutes:</p>
	<h2 style="color: #4CAF50;">${otpValue}</h2>
	<p>If you did not request this setup, please disregard this email.</p>
	<p>Warm regards,<br>The Glimmr Team</p>
	`,
			);
		} catch (otpError: any) {
			await Shop.findByIdAndDelete(newShop._id);
			return ErrorHandler.send(res, 500, otpError);
		}

		const token = generateToken(
			{
				_id: newShop._id!.toString(),
				name: newShop.shopName,
				email: newShop.shopEmail,
			},
			res,
		);

		const shopDTO = new ShopDTO(newShop as ShopDTO);

		ResponseHandler.send(res, 201, "Shop created successfully", shopDTO, token);
	} catch (error: any) {
		return ErrorHandler.send(
			res,
			500,
			`Internal Server Error ${error.message}`,
		);
	}
};

export const shopLogin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = ShopLoginSchemaSchema.validate(req.body);
	if (error) {
		return next(error);
	}
	const { shopEmail, password } = req.body;
	try {
		const existingShop = await Shop.findOne({ shopEmail });
		if (!existingShop) {
			return ErrorHandler.send(res, 404, "Shop not found");
		}

		const decryptPassword = await bcrypt.compare(
			password,
			existingShop.password,
		);
		if (!decryptPassword) {
			return ErrorHandler.send(res, 401, "Invalid credentials");
		}

		const token = generateToken(
			{
				_id: existingShop?._id!.toString(),
				name: existingShop?.shopName ?? "",
				email: existingShop?.shopEmail ?? "",
			},
			res,
		);

		ResponseHandler.send(
			res,
			200,
			"Login successfully",
			existingShop ? new ShopDTO(existingShop as ShopDTO) : undefined,
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
