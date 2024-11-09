import { Request, Response } from "express";
import ResponseHandler from "../../utils/ResponseHandler";
import UserSchema from "../../schemas/user/UserSchema.schema";

export const signup = async (req: Request, res: Response) => {
	const { error } = UserSchema.validate(req.body);
	const { name, email, phoneNumber, password } = req.body;
};
