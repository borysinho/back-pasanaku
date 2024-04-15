// Función que se va a dedicar a responder
import { Response } from "express";
import { HttpStatusCodes } from "./http.status.code.utils";

// Si estamos respondiendo es porque no hubo ningún error
export const response = (
  res: Response,
  statusCode: HttpStatusCodes,
  data: any
) => {
  res.status(statusCode).json({
    error: false,
    data,
  });
};
