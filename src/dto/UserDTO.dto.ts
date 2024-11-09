interface UserDTOClass {
	_id: string | any;
	name: string;
	email: string;
	profilePic: string;
	phoneNumber: string;
	verified: boolean;
}

class UserDTO {
	_id: string | any;
	name: string;
	email: string;
	profilePic: string;
	phoneNumber: string;
	verified: boolean;
	constructor(user: UserDTOClass) {
		this._id = user._id;
		this.name = user.name;
		this.email = user.email;
		this.profilePic = user.profilePic;
		this.phoneNumber = user.phoneNumber;
		this.verified = user.verified;
	}
}

export default UserDTO;
