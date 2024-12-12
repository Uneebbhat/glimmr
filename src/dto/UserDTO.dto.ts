import { Types } from "mongoose";
import { UserDTOClass } from "../shared/interfaces/UserInterface";

class UserDTO {
	_id: string | Types.ObjectId;
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
