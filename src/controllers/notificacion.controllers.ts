import { Request, Response } from "express";
import { catchedAsync, HttpException } from "../exceptions";
import {
  notificarDescargarOUnirse,
  notificarGanadorDeTurno,
  notificarInicioOfertas,
  notificarPorCorreo,
  notificarPorWhatsapp,
} from "../services/notificacion.service";
import { HttpStatusCodes200, HttpStatusCodes400, response } from "../utils";

const enviarCorreo = async (id_juego: number, idsInvitados: []) => {
  const mensajesCorreo = await notificarPorCorreo(idsInvitados, id_juego);

  if (mensajesCorreo instanceof HttpException) {
    return { mailResult: mensajesCorreo.getAttr() };
  } else {
    return mensajesCorreo;
  }
};

const notificacionParaDescargarOUnirse = async (
  req: Request,
  res: Response
) => {
  // try {

  const { idsInvitados } = req.body;
  const { id } = req.params;
  // const mensajesCorreo = await enviarCorreo(parseInt(id), idsInvitados);

  const invitaciones = await notificarDescargarOUnirse(
    parseInt(id),
    idsInvitados
  );

  response(res, HttpStatusCodes200.ACCEPTED, invitaciones);
};

const inicioDeOfertas = async (req: Request, res: Response) => {
  const { id_juego, id_turno } = req.params;
  if (id_juego) {
    const ofertas = await notificarInicioOfertas(
      parseInt(id_juego),
      parseInt(id_turno)
    );
    console.log({ ofertas });
    response(res, HttpStatusCodes200.ACCEPTED, ofertas);
  } else {
    throw new HttpException(
      HttpStatusCodes400.NOT_FOUND,
      "Se esperaba id_juego"
    );
  }
};

const finDeOfertas = async (req: Request, res: Response) => {
  const { id_juego } = req.params;
  const ganador = notificarGanadorDeTurno(parseInt(id_juego));
  response(res, HttpStatusCodes200.OK, ganador);
};

const testNotificarGanador = async (req: Request, res: Response) => {
  const { id_juego } = req.params;

  const ganador = await notificarGanadorDeTurno(parseInt(id_juego));
  response(res, 200, ganador);
};

export default {
  notificacionParaDescargarOUnirse: catchedAsync(
    notificacionParaDescargarOUnirse
  ),
  inicioDeOfertas: catchedAsync(inicioDeOfertas),
  finDeOfertas: catchedAsync(finDeOfertas),
  testNotificarGanador: catchedAsync(testNotificarGanador),
};
