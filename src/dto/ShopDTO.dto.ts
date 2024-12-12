import { Types } from "mongoose";

interface ShopDTOClass {
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

class ShopDTO {
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

	constructor(shop: ShopDTOClass) {
		this._id = shop._id;
		this.ownerName = shop.ownerName;
		this.shopName = shop.shopName;
		this.shopEmail = shop.shopEmail;
		this.shopProfilePic = shop.shopProfilePic;
		this.shopPhoneNumber = shop.shopPhoneNumber;
		this.location = { ...shop.location };
		this.verified = shop.verified;
	}
}

export default ShopDTO;
