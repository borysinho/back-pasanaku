import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { Query } from "express-serve-static-core";
import { catchedAsync, HttpException } from "../exceptions";
import {
  actualizarInvitado,
  buscarInvitado,
  crearInvitado,
  eliminarInvitado,
  obtenerCorreosInvitados,
  obtenerInvitado,
  obtenerInvitados,
  obtenerInvitadosDeJuego,
} from "../services/invitado.service";
import { obtenerCuentaCreadaDeUnInvitado } from "../services/jugador.service";
import {
  HttpStatusCodes200,
  HttpStatusCodes400,
  HttpStatusCodes500,
  response,
} from "../utils";
import { aceptarInvitacion } from "../services";

const crear = async (req: Request, res: Response) => {
  const { id_juego } = req.params;
  const { telf, correo, nombre } = req.body;
  if (id_juego && telf && correo && nombre) {
    // console.log({ id_juego, id_jugador_creador, telf, correo, nombre });

    const invitado = await crearInvitado(
      parseInt(id_juego),
      nombre,
      correo,
      telf
    );
    response(res, HttpStatusCodes200.OK, invitado);
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Se esperaban mas parámetros para poder ejecutar la petición."
    );
  }
};

const mostrarUno = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invitado = await obtenerInvitado(parseInt(id));
  response(res, HttpStatusCodes200.OK, invitado);
};

const mostrarTodos = async (req: Request, res: Response) => {
  const invitados = await obtenerInvitados();
  response(res, HttpStatusCodes200.OK, invitados);
};

const actualizar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invitadoData: Prisma.InvitadosUpdateInput = req.body;
  const invitado = await actualizarInvitado(parseInt(id), invitadoData);
  response(res, HttpStatusCodes200.OK, invitado);
};

const eliminar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invitado = await eliminarInvitado(parseInt(id));
  response(res, HttpStatusCodes200.OK, invitado);
};

const invitadosJuego = async (req: Request, res: Response) => {
  const { idjuego } = req.params;
  const invitados = await obtenerInvitadosDeJuego(parseInt(idjuego));
  response(res, HttpStatusCodes200.OK, invitados);
};

const correosInvitados = async (req: Request, res: Response) => {
  const { idsInvitados } = req.body;
  const invitados = await obtenerCorreosInvitados(idsInvitados);
  response(res, HttpStatusCodes200.OK, invitados);
};

interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

const validarDatosInvitado = async (
  req: TypedRequestQuery<{ telf: string; correo: string }>,
  res: Response
) => {
  try {
    const correo = req.query.correo;
    const telf = req.query.telf;

    const invitado = await buscarInvitado(correo, `+${telf}`);
    if (invitado) {
      const existeCuentaCreada = await obtenerCuentaCreadaDeUnInvitado(
        invitado.id
      );

      if (existeCuentaCreada) {
        throw new HttpException(
          HttpStatusCodes500.INTERNAL_SERVER_ERROR,
          "Ya existe una cuenta registrada con ese teléfono y correo"
        );
      } else {
        response(res, HttpStatusCodes200.OK, invitado);
      }
    } else {
      throw new HttpException(
        HttpStatusCodes500.INTERNAL_SERVER_ERROR,
        "No se encuentran los datos del invitado."
      );
    }
  } catch (error: any) {
    throw new HttpException(HttpStatusCodes400.BAD_REQUEST, error.message);
  }
};

const aceptarInvitacionDeJuego = async (req: Request, res: Response) => {
  const { id_juego, id_jugador, id_invitado } = req.params;
  const detalleIngreso = await aceptarInvitacion(
    parseInt(id_juego),
    parseInt(id_jugador),
    parseInt(id_invitado)
  );

  response(res, HttpStatusCodes200.OK, detalleIngreso);
};

export default {
  crear: catchedAsync(crear),
  mostrarUno: catchedAsync(mostrarUno),
  mostrarTodos: catchedAsync(mostrarTodos),
  actualizar: catchedAsync(actualizar),
  eliminar: catchedAsync(eliminar),
  invitadosJuego: catchedAsync(invitadosJuego),
  correosInvitados: catchedAsync(correosInvitados),
  validarDatosInvitado: catchedAsync(validarDatosInvitado),
  aceptarInvitacionDeJuego: catchedAsync(aceptarInvitacionDeJuego),
};
