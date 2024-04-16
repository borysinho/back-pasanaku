import { Request, Response } from "express";
import {
  HttpException,
  HttpStatusCodes200,
  HttpStatusCodes400,
  HttpStatusCodes500,
  catchedAsync,
  response,
} from "../utils";
import { validarCuenta } from "../services";
//
import { SignJWT, jwtVerify } from "jose";
import { Prisma } from "@prisma/client";

const login = async (req: Request, res: Response) => {
  console.log(req.body);
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena)
    throw new HttpException(
      HttpStatusCodes400.UNAUTHORIZED,
      "Se deben proporcionar los datos correo y password"
    );

  // Validamos que el usuario y la contraseña coincidan
  const jugador = await validarCuenta({ usuario, contrasena });

  if (jugador) {
    //Generamos un token y lo devolvemos.

    //Enviamos el payLoad, la información que va a tener ese Token
    const { id, usuario } = jugador;

    const jwtContructor = new SignJWT({ id, usuario });

    //Generamos el HWT
    //ProtectedHeader: Los parámetros del objeto cabecera
    //IssuedAt: Fecha de creación
    //ExpirationTime: Fecha de expiración
    //sign: La firma
    const secret: Uint8Array = new TextEncoder().encode(
      process.env.JWT_PRIVATE_KEY
    );
    const jwt = await jwtContructor
      .setProtectedHeader({
        alg: "HS256",
        typ: "JWT",
      })
      .setIssuedAt()
      .setExpirationTime("1y")
      .sign(secret);

    response(res, HttpStatusCodes200.OK, { jwt, jugador });
  } else {
    throw new HttpException(
      HttpStatusCodes500.INTERNAL_SERVER_ERROR,
      "No se encontró una cuenta con los datos especificados"
    );
  }

  // Respondemos usuario autenticado
};

const validarToken = async (req: Request, res: Response) => {
  // Obtenemos las cabeceras
  const { authorization } = req.headers;

  if (!authorization)
    throw new HttpException(
      HttpStatusCodes400.UNAUTHORIZED,
      "Se esperaba la cabecera authorization."
    );

  const secret: Uint8Array = new TextEncoder().encode(
    process.env.JWT_PRIVATE_KEY
  );
  const jwData = await jwtVerify(authorization, secret);
  response(res, 200, jwData);
  // const jugador: Prisma.JugadoresWhereUniqueInput = jwData;
};

export default {
  login: catchedAsync(login),
  validarToken: catchedAsync(validarToken),
};
