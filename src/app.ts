import express, { Application, NextFunction, Request, Response } from "express";
import dbConnect from "./config/dbConnect";
import ErrorHandler from "./utils/ErrorHandler";
import userRouter from "./routes/user/userRouter.routes";

const app: Application = express();

dbConnect();

// Middlewares
app.use(express.json());

// Main routes
app.use("/api", userRouter);

// 404 Handler for undefined routes
app.use((req: Request, res: Response) => {
	ErrorHandler.send(res, 404, "Route not found");
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	ErrorHandler.send(res, 500, "Internal Server Error");
});

export default app;
