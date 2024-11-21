import { config } from "dotenv";

config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;
const JWT_SECRET = process.env.JWT_SECRET;
const CLOUD_NAME = process.env.CLOUDINARY_NAME;
const CLOUD_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const DEFAULT_IMG = process.env.DEFAULT_IMAGE;
const DEFAULT_SHOP = process.env.DEFAULT_SHOP_IMAGE;
const NODE_PORT = process.env.NODEMAILER_PORT;
const NODE_HOST = process.env.NODEMAILER_HOST;
const NODE_SERVICE = process.env.NODEMAILER_SERVICE;
const NODE_USER = process.env.NODEMAILER_USER;
const NODE_PASS = process.env.NODEMAILER_PASS;

export {
	PORT,
	MONGODB_URI,
	JWT_SECRET,
	CLOUD_NAME,
	CLOUD_API_KEY,
	CLOUD_API_SECRET,
	DEFAULT_IMG,
	DEFAULT_SHOP,
	NODE_PORT,
	NODE_HOST,
	NODE_SERVICE,
	NODE_USER,
	NODE_PASS,
};
