import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (errors) {
    res.status(403).send(errors);
  }
};
