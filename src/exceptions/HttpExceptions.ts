export class HttpException extends Error {
  statusCode: number;
  status: string;
  message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.status = "error";
    this.statusCode = statusCode;
    this.message = message;
  }
}
