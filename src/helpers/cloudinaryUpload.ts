import { v2 as cloudinary } from "cloudinary";
import { Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinaryConfig from "../config/cloudinary";

cloudinaryConfig();

const cloudinaryUpload = async (filepath: string, options = {}, res: Response) => {
	try {
		return await cloudinary.uploader.upload(filepath, options);
	} catch (err: any) {
		return ErrorHandler.send(res, 400, "Error while uploading image");
	}
};

export default cloudinaryUpload;