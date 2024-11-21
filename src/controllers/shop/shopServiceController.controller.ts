import { Request, Response, NextFunction } from "express";
import ShopServiceSchema from "../../schemas/shop/ShopServiceSchema.schema";
import ErrorHandler from "../../utils/ErrorHandler";
import ShopService from "../../models/shop/ShopService.model";
import ResponseHandler from "../../utils/ResponseHandler";
import cloudinaryUpload from "../../helpers/cloudinaryUpload";

export const createService = async (req: Request, res: Response, next: NextFunction) => {
	const { error } = ShopServiceSchema.validate(req.body);
	if (error) {
		next(error);
	}

	const {
		shopId,
		serviceName,
		category,
		serviceDescription,
		servicePrice,
		serviceDiscount,
		doorStepPrice,
		doorStepDiscount,
	} = req.body;

	try {
		let serviceImages: string[] = [];

		if (req.files && Array.isArray(req.files)) {
			for (const file of req.files) {
				try {
					const serviceImageURL = await cloudinaryUpload(file.path, {
						folder: "glimmr/services_img",
					}, res);
					if (serviceImageURL?.secure_url) {
						serviceImages.push(serviceImageURL.secure_url);
					}
					// console.log(serviceImageURL?.secure_url);
				} catch (uploadError) {
					return ErrorHandler.send(res, 500, "Error uploading images");
				}
			}
		}

		const newService = await ShopService.create({
			shopId,
			serviceImages,
			serviceName,
			category,
			serviceDescription,
			servicePrice,
			serviceDiscount,
			doorStepPrice,
			doorStepDiscount,
		});
		if (!newService) {
			return ErrorHandler.send(res, 400, "Error occurred while creating service");
		}

		ResponseHandler.send(res, 201, "Service created successfully", newService);
	} catch (err: any) {
		return ErrorHandler.send(res, 500, `Internal Server Error, ${err.message}`);
	}
};