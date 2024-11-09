import { Response } from "express";

class ErrorHandler {
  static send(res: Response, statusCode: number, error: string) {
    return res
      .status(statusCode)
      .json({ status: statusCode, success: false, error });
  }
}

export default ErrorHandler;
