interface ShopDTOClass {
	_id: string | any;
	userName: string;
	shopName: string;
	shopEmail: string;
	shopProfilePic?: string;
	shopPhoneNumber: string;
	location: {
		shopAddress: string;
		shopCity: string;
		cityArea: string;
	};
}

class ShopDTO {
	_id: string | any;
	userName: string;
	shopName: string;
	shopEmail: string;
	shopProfilePic?: string;
	shopPhoneNumber: string;
	location: {
		shopAddress: string;
		shopCity: string;
		cityArea: string;
	};
	constructor(shop: ShopDTOClass) {
		this._id = shop._id;
		this.userName = shop.userName;
		this.shopName = shop.shopName;
		this.shopEmail = shop.shopEmail;
		this.shopProfilePic = shop.shopProfilePic;
		this.shopPhoneNumber = shop.shopPhoneNumber;
		this.location = { ...shop.location };
	}
}

export default ShopDTO;
