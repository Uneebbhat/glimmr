import { Response } from "express";

class ResponseHandler {
  static send(
    res: Response,
    statusCode: number,
    message: string,
    data?: {},
    token?: {}
  ) {
    return res
      .status(statusCode)
      .json({ status: statusCode, success: true, message, data, token });
  }
}
export default ResponseHandler;
