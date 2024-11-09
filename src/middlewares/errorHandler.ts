import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";

const errorHandler = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	let status = 500;
	let data = {
		message: "Internal Server Error",
	};

	if (error instanceof ValidationError) {
		status = 400;
		data.message = error.message;
		res.status(status).json(data);
		return;
	}

	if (error.status) {
		status = error.status;
	}

	if (error.message) {
		data.message = error.message;
	}

	res.status(status).json(data);
};

export default errorHandler;
