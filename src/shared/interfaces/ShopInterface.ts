import { Document, Types } from "mongoose";
import { ServiceCategory } from "../models/shop/ShopService.model";

export interface ShopDTOClass {
	_id: string | Types.ObjectId;
	ownerName: string;
	shopName: string;
	shopEmail: string;
	shopProfilePic: string;
	shopPhoneNumber: string;
	location: {
		shopAddress: string;
		shopCity: string;
		cityArea: string;
	};
	verified: boolean;
}

export interface IShop extends Document {
	shopProfilePic: string;
	ownerName: string;
	shopName: string;
	shopEmail: string;
	shopPhoneNumber: string;
	password: string;
	location: {
		shopAddress: string;
		shopCity: string;
		cityArea: string;
	};
	verified: boolean;
}

export interface IShopService extends Document {
	shopId: Types.ObjectId;
	serviceName: string;
	category: ServiceCategory;
	serviceDescription: string;
	servicePrice: number;
	serviceDiscount?: number;
	doorStepPrice?: number;
	doorStepDiscount?: number;
	serviceImages: string[];
}
