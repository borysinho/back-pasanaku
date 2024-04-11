import { Query } from "express-serve-static-core";
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

export const crearConInvitacion = async (req: Request, res: Response) => {
  try {
    const jugadorData: Prisma.JugadoresCreateInput = req.body.jugador;
    const invitadoData: Prisma.InvitadosCreateInput = req.body.invitado;

    const jugador = await crearJugadorAPartirDeInvitacion(
      jugadorData,
      invitadoData
    );

    return res.status(201).json({
      message: "Jugador creado correctamente",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controllers.crear",
      Errors: error,
    });
  }
};

export const crearSinInvitacion = async (req: Request, res: Response) => {
  try {
    const jugadorData: Prisma.JugadoresCreateInput = req.body.jugador;
    const invitadoData: Prisma.InvitadosCreateInput = req.body.invitado;

    console.log({ jugadorData, invitadoData });

    const jugador = await crearJugadorSinSerInvitado(jugadorData, invitadoData);

    return res.status(201).json({
      message: "Jugador creado correctamente",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controllers.crear",
      Errors: error,
    });
  }
};

export const mostrarTodos = async (req: Request, res: Response) => {
  try {
    const jugadores = await obtenerJugadores();
    return res.status(201).json({
      message: "Lista de jugadores",
      data: jugadores,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controllers.mostrarTodos",
      Errors: error,
    });
  }
};

export const mostrarUno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const jugador = await obtenerJugador(parseInt(id));
    return res.status(201).json({
      message: "Lista de jugadores",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controllers.mostrarUno",
      Errors: error,
    });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const jugadorData: Prisma.JugadoresUpdateInput = req.body;
    const invitadoData: Prisma.InvitadosUpdateInput = req.body;
    const { nombre, correo, telf } = req.body;
    const jugador = await actualizarJugador(jugadorData, invitadoData, id);
    return res.status(201).json({
      message: "Datos Actualizados Correctamente",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controllers.actualizar",
      Errors: error,
    });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const jugador = await eliminarJugador(id);

    return res.status(201).json({
      message: "Jugador eliminado correctamente",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controllers.eliminar",
      Errors: error,
    });
  }
};

interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

export const buscarUsuarioDeJugador = async (
  req: TypedRequestQuery<{ usuario: string }>,
  res: Response
) => {
  try {
    const { usuario }: Prisma.JugadoresWhereUniqueInput = req.query;
    const usuarioBuscado = await existeUsuario(usuario);
    console.log({ usuario, usuarioBuscado });
    if (usuarioBuscado) {
      return res.status(201).json({
        message: "Datos obtenidos correctamente",
        status: "correcto",
        data: usuarioBuscado,
      });
    } else {
      return res.status(201).json({
        message:
          "No existe el una cuenta registrada con el usuario especificado",
        status: "incorrecto",
        data: usuarioBuscado,
      });
    }
  } catch (error: any) {
    return res.status(402).json({
      message: "Error en jugador.controllers.buscarUsuario",
      Errors: error,
    });
  }
};
