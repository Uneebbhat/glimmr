import mongoose from "mongoose";
import { MONGODB_URI } from "./constants";

const dbConnect = async () => {
	try {
		const conn = await mongoose.connect(MONGODB_URI as string);
		console.log(`Connected to MongoDB: ${conn.connection.host}`);
	} catch (error: any) {
		console.log(`Error connecting to database: ${error.message}`);
	}
};

export default dbConnect;
