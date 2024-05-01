import prisma from "./prisma.service";
export const obtenerPagosTurnos = async (id_turno: number) => {
  const pagos_turnos = await prisma.pagos.findMany({
    where: {
      pagos_turnos: {
        some: {
          id_turno,
        },
      },
    },
    include: {
      pagos_turnos: true,
    },
  });

  console.log({ pagos_turnos });
  return pagos_turnos;
};
