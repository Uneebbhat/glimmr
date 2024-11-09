import mongoose from "mongoose";
import { MONGODB_URI } from "./constants";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI as string);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (err: any) {
    console.log(`Error connecting to database: ${err.message}`);
  }
};

export default dbConnect;
