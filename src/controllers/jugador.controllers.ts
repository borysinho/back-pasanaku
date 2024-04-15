import { Query } from "express-serve-static-core";
import {
  catchedAsync,
  response,
  HttpStatusCodes200,
  HttpException,
  httpStatusCodes,
  HttpStatusCodes400,
} from "../utils";
import { Request, Response } from "express";
import {
  actualizarJugador,
  eliminarJugador,
  obtenerJugadores,
  obtenerJugador,
  crearJugadorSinSerInvitado,
  crearJugadorAPartirDeInvitacion,
  existeUsuario,
} from "../services/jugador.service";
import { Prisma } from "@prisma/client";

const crearConInvitacion = async (req: Request, res: Response) => {
  const jugadorData: Prisma.JugadoresCreateInput = req.body.jugador;
  const invitadoData: Prisma.InvitadosCreateInput = req.body.invitado;

  const jugador = await crearJugadorAPartirDeInvitacion(
    jugadorData,
    invitadoData
  );
  response(res, HttpStatusCodes200.CREATED, jugador);
};

const crearSinInvitacion = async (req: Request, res: Response) => {
  const jugadorData: Prisma.JugadoresCreateInput = req.body.jugador;
  const invitadoData: Prisma.InvitadosCreateInput = req.body.invitado;

  console.log({ jugadorData, invitadoData });
  const jugador = await crearJugadorSinSerInvitado(jugadorData, invitadoData);
  response(res, HttpStatusCodes200.CREATED, jugador);
};

const mostrarTodos = async (req: Request, res: Response) => {
  const jugadores = await obtenerJugadores();
  response(res, HttpStatusCodes200.OK, jugadores);
};

const mostrarUno = async (req: Request, res: Response) => {
  const { id } = req.params;
  const jugador = await obtenerJugador(parseInt(id));
  response(res, HttpStatusCodes200.OK, jugador);
};

const actualizar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const jugadorData: Prisma.JugadoresUpdateInput = req.body;
  const invitadoData: Prisma.InvitadosUpdateInput = req.body;
  const jugador = await actualizarJugador(jugadorData, invitadoData, id);
  response(res, HttpStatusCodes200.OK, jugador);
};

const eliminar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const jugador = await eliminarJugador(id);

  response(res, HttpStatusCodes200.OK, jugador);
};

interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

const buscarUsuarioDeJugador = async (
  req: TypedRequestQuery<{ usuario: string }>,
  res: Response
) => {
  const { usuario }: Prisma.JugadoresWhereUniqueInput = req.query;
  const usuarioBuscado = await existeUsuario(usuario);
  console.log({ usuario, usuarioBuscado });
  response(res, HttpStatusCodes200.OK, usuarioBuscado);
};

export default {
  crearConInvitacion: catchedAsync(crearConInvitacion),
  crearSinInvitacion: catchedAsync(crearSinInvitacion),
  mostrarTodos: catchedAsync(mostrarTodos),
  mostrarUno: catchedAsync(mostrarUno),
  actualizar: catchedAsync(actualizar),
  eliminar: catchedAsync(eliminar),
  buscarUsuarioDeJugador: catchedAsync(buscarUsuarioDeJugador),
};
