import { Request, Response } from "express";

import { HttpStatusCodes200, response } from "../utils";

import { HttpException, catchedAsync } from "../exceptions";
import { Prisma } from "@prisma/client";
import {
  srvCreatePagosMultas,
  srvDeletePagosMultas,
  srvGetPagosMultas,
  srvGetPagosMultasById,
  srvSolicitudesDePagoMultaSinPagarDeJugador_Juego,
  srvUpdatePagosMultas,
} from "../services/multa.service";

const ctrlGetPagosMultas = catchedAsync(async (req: Request, res: Response) => {
  const { id_jugador_juego, id_juego } = req.params;
  const pago = await srvGetPagosMultas(
    parseInt(id_jugador_juego),
    parseInt(id_juego)
  );

  response(res, HttpStatusCodes200.OK, pago);
});

const ctrlGetPagosMultasById = catchedAsync(
  async (req: Request, res: Response) => {
    const { id_solicitud_pago_multa, id_turno } = req.params;
    const pago = await srvGetPagosMultasById(
      parseInt(id_solicitud_pago_multa),
      parseInt(id_turno)
    );
    response(res, HttpStatusCodes200.OK, pago);
  }
);

const ctrlCreatePagosMultas = catchedAsync(
  async (req: Request, res: Response) => {
    const { id_solicitud_pago_multa, id_turno } = req.params;
    const data: Prisma.PagosTurnosCreateInput = req.body;

    const pago = await srvCreatePagosMultas(
      parseInt(id_solicitud_pago_multa),
      parseInt(id_turno),
      data
    );

    response(res, HttpStatusCodes200.OK, pago);
  }
);

const ctrlUpdatePagosMultas = catchedAsync(
  async (req: Request, res: Response) => {
    const { id_solicitud_pago_multa, id_turno } = req.params;
    const data: Prisma.PagosTurnosUpdateInput = req.body;

    const pago = await srvUpdatePagosMultas(
      parseInt(id_solicitud_pago_multa),
      parseInt(id_turno),
      data
    );

    response(res, HttpStatusCodes200.OK, pago);
  }
);

const ctrlDeletePagosMultas = catchedAsync(
  async (req: Request, res: Response) => {
    const { id_solicitud_pago_multa, id_turno } = req.params;

    const pago = await srvDeletePagosMultas(
      parseInt(id_solicitud_pago_multa),
      parseInt(id_turno)
    );

    response(res, HttpStatusCodes200.OK, pago);
  }
);

const ctrlGetSolicitudesDePagoMultaSinPagarDeJugador_Juego = catchedAsync(
  async (req: Request, res: Response) => {
    const { id_jugador_juego } = req.params;
    const multas = await srvSolicitudesDePagoMultaSinPagarDeJugador_Juego(
      parseInt(id_jugador_juego)
    );

    response(res, HttpStatusCodes200.OK, multas);
  }
);

export default {
  ctrlGetPagosMultas,
  ctrlGetPagosMultasById,
  ctrlCreatePagosMultas,
  ctrlUpdatePagosMultas,
  ctrlDeletePagosMultas,
  ctrlGetSolicitudesDePagoMultaSinPagarDeJugador_Juego,
};
