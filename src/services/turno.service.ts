import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";

export const crearTurno = async(id_juego: number, payLoad: Prisma.TurnosUpdateInput) => {
  const data: Prisma.TurnosUpdateInput = {...payLoad, }
  const turno = prisma.turnos.create({
    data: {
      id_juego,
      
    }
  })
} 