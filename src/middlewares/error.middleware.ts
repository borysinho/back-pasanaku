import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions";
import { Prisma } from "@prisma/client";
import { errors } from "jose";

export function errorMiddleware(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  // const { error } = err;

  console.log("instance: ", err);

  /**
   * Errores de Prisma
   */
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { clientVersion, code, name, batchRequestIdx, meta, message } = err;

    response.status(503).send({
      error: true,
      message: {
        PrismaError: {
          clientVersion,
          name,
          code,
          meta,
          message,
        },
      },
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    const { clientVersion, name, errorCode, message } = err;

    response.status(503).send({
      error: true,
      message: {
        PrismaError: {
          clientVersion,
          name,
          errorCode,
          message,
        },
      },
    });
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    const { clientVersion, name, message } = err;

    response.status(503).send({
      error: true,
      message: {
        PrismaError: {
          clientVersion,
          name,
          message,
        },
      },
    });
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const { clientVersion, name, message } = err;

    response.status(503).send({
      error: true,
      message: {
        PrismaError: {
          clientVersion,
          name,
          message,
        },
      },
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    const { clientVersion, name, message } = err;

    response.status(503).send({
      error: true,
      message: {
        PrismaError: {
          clientVersion,
          name,
          message,
        },
      },
    });
  }

  /**
   * Errores generales de HTTP
   */

  if (err instanceof HttpException) {
    const status = err.status || 400;
    const message = err.message || "Algo salió mal";

    response.status(status).send({
      error: true,
      message,
    });
  }
  /**
   * Errores generales de JWT
   */

  if (
    err instanceof errors.JOSEError
    // (errors.JOSEAlgNotAllowed,
    // errors.JOSEError,
    // errors.JOSENotSupported,
    // errors.JWEDecryptionFailed,
    // errors.JWEInvalid,
    // errors.JWEInvalid,
    // errors.JWKSInvalid,
    // errors.JWKSMultipleMatchingKeys,
    // errors.JWKSNoMatchingKey,
    // errors.JWKSTimeout,
    // errors.JWSInvalid,
    // errors.JWSSignatureVerificationFailed,
    // errors.JWTClaimValidationFailed,
    // errors.JWTExpired,
    // errors.JWTInvalid)
  ) {
    const { code, message, name, stack } = err;
    response.status(401).send({
      error: true,
      JWTError: {
        code,
        message,
      },
    });
  }

  /**
   * Errores de correo
   */

  response.status(500).send({
    error: true,
    message: err,
  });
  // }
}

// export default errorMiddleware;

// import { Request, Response, NextFunction } from "express";
// import { HttpException } from "../utils";

// export const errorHandler = (
//   err: unknown,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log(err);
//   if (err instanceof ClientError) {
//     res.status(err.statusCode).send(err.message);
//   } else {
//     res.status(400).send("Algún tipo de error");
//   }
// };
