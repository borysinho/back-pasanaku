import {
  HttpStatusCodes,
  HttpStatusCodes400,
} from "../utils/http.status.code.utils";

export class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }

  /**
   * getAttr
   */
  public getAttr() {
    return {
      error: true,
      message: this.message,
    };
  }
}
