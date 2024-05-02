import { Request, Response } from "express";
import { catchedAsync } from "../exceptions";
import {
  crearPagos_Turnos,
  obtenerPagosDeJugador_JuegoEnTurno,
  obtenerPagosTurnos,
  obtenerSolicitudesDePagoDeJugador_Juego,
} from "../services";
import { HttpStatusCodes200, response } from "../utils";

const obtenerPagosDeUnTurno = async (req: Request, res: Response) => {
  // try {
  const { id_turno } = req.params;

  const pagos = await obtenerPagosTurnos(parseInt(id_turno));

  response(res, HttpStatusCodes200.ACCEPTED, pagos);
};

const obtenerPagosDeJugador_JuegoEnUnTurnoEspecifico = async (
  req: Request,
  res: Response
) => {
  const { id_jugador_juego, id_turno } = req.params;

  const pagos = await obtenerPagosDeJugador_JuegoEnTurno(
    parseInt(id_jugador_juego),
    parseInt(id_turno)
  );

  response(res, HttpStatusCodes200.ACCEPTED, pagos);
};

const crearPagoDeUnTurno = async (req: Request, res: Response) => {
  const { id_jugador_juego, id_turno } = req.params;
  const { monto_pagado, detalle } = req.body;

  const pago = await crearPagos_Turnos(
    parseInt(id_jugador_juego),
    parseInt(id_turno),
    monto_pagado,
    detalle
  );

  response(res, HttpStatusCodes200.CREATED, pago);
};

const obtenerSolicitudesDePagoDesdeUnJugador_Juego = async (
  req: Request,
  res: Response
) => {
  const { id_jugador_juego } = req.params;

  const pagos = await obtenerSolicitudesDePagoDeJugador_Juego(
    parseInt(id_jugador_juego)
  );

  response(res, HttpStatusCodes200.ACCEPTED, pagos);
};

export default {
  obtenerPagosDeUnTurno: catchedAsync(obtenerPagosDeUnTurno),
  obtenerPagosDeJugador_JuegoEnUnTurnoEspecifico: catchedAsync(
    obtenerPagosDeJugador_JuegoEnUnTurnoEspecifico
  ),
  crearPagoDeUnTurno: catchedAsync(crearPagoDeUnTurno),
  obtenerSolicitudesDePagoDesdeUnJugador_Juego: catchedAsync(
    obtenerSolicitudesDePagoDesdeUnJugador_Juego
  ),
};
