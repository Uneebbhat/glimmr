import { Document, Types } from "mongoose";

export interface IUser extends Document {
	profilePic: string;
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
	verified: boolean;
}

export interface UserDTOClass {
	_id: string | Types.ObjectId;
	name: string;
	email: string;
	profilePic: string;
	phoneNumber: string;
	verified: boolean;
}

export interface UserToken {
	_id: string;
	name: string;
	email: string;
}
