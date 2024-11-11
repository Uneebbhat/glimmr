import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants";
import ErrorHandler from "../utils/ErrorHandler";
import { Response } from "express";

interface UserToken {
	_id: string;
	name: string;
	email: string;
}

const generateToken = (user: UserToken, res: Response) => {
	if (!JWT_SECRET) {
		ErrorHandler.send(res, 500, "JWT Secret is not defined.");
	}

	const token = jwt.sign(
		{ userId: user._id, name: user.name, userEmail: user.email },
		JWT_SECRET as string,
		{
			expiresIn: "7d",
		},
	);

	return token;
};

export default generateToken;
