import prisma from "./prisma.service";
import { Prisma } from "@prisma/client";

export const srvGetPagosMultas = async (
  id_jugador_juego: number,
  id_juego: number
) => {
  const pagosMultas = await prisma.pagosTurnos.findMany({
    where: {
      pago: {
        id_jugador_juego,
      },
      turno: {
        id_juego,
      },
    },
  });

  return pagosMultas;
};

export const srvGetPagosMultasById = async (
  id_solicitud_pago_multa: number,
  id_turno: number
) => {
  const pagoMulta = await prisma.pagosTurnos.findFirst({
    where: {
      id_pago: id_solicitud_pago_multa,
      id_turno,
    },
  });

  return pagoMulta;
};

export const srvCreatePagosMultas = async (
  id_solicitud_pago_multa: number,
  id_turno: number,
  data: Prisma.PagosTurnosCreateInput
) => {
  const pagoMulta = await prisma.pagosTurnos.create({
    data: {
      ...data,
      pago: {
        connect: {
          id: id_solicitud_pago_multa,
        },
      },
      turno: {
        connect: {
          id: id_turno,
        },
      },
    },
  });

  return pagoMulta;
};

export const srvUpdatePagosMultas = async (
  id_solicitud_pago_multa: number,
  id_turno: number,
  data: Prisma.PagosTurnosUpdateInput
) => {
  const pagoMulta = await prisma.pagosTurnos.update({
    where: {
      id: {
        id_pago: id_solicitud_pago_multa,
        id_turno,
      },
    },
    data,
  });

  return pagoMulta;
};

export const srvDeletePagosMultas = async (
  id_solicitud_pago_multa: number,
  id_turno: number
) => {
  const pagoMulta = await prisma.pagosTurnos.delete({
    where: {
      id: {
        id_pago: id_solicitud_pago_multa,
        id_turno,
      },
    },
  });

  return pagoMulta;
};
