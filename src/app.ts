import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConnect";
import ErrorHandler from "./utils/ErrorHandler";
import userRouter from "./routes/user/userRouter.routes";
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();

dbConnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Main routes
app.use("/api", userRouter);

// 404 Handler for undefined routes
app.use((req: Request, res: Response) => {
	ErrorHandler.send(res, 404, "Route not found");
});

// Global error handler (should be the last middleware)
app.use(errorHandler);

export default app;
