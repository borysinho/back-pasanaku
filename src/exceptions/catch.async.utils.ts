import { Request, Response, NextFunction } from "express";
import { HttpException } from "./http.exception";

//FUNCIÓN DE ORDEN SUPERIOR

// Esta función recibe una función, un controlador cualquiera y va a retornar una función que va a ejecutar ese controlador y que ante cualquier error de ese controlador lo va obtener por catch (el error handler lo va a recibir ) y se va a encargar de enviarlo al manejador de erores de express
export const catchedAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //Ejecuta la función con req y next y que ante cualquier problema que ocurra (.catch)
    //El catch nos sirve para establecer un error handler. Este catch es el error handler de una promesa que se resuelve a lo que retorna y se rechaza al error que arroja
    // Entonces el catch recibe el error, y a ese error lo manda al manejador de errores de express
    fn(req, res).catch((err: HttpException) => next(err));
  };
};
