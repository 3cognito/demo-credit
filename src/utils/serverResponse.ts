import { Request, Response } from "express";
import Logger from "./logger";

export function ServerResponse(req: Request, res: Response, code: number, data: any, message: string | null) {
  Logger.info(`[${req.method}] - [${req.originalUrl}] -  [${req.ip}] - [${req.statusCode}] - [${JSON.stringify(data)}]`);
  res.status(code).json({
    status: "success",
    message,
    data,
  });
}
