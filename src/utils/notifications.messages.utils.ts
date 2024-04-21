import { calcularFinDeOfertas, formatearTiempo } from "./fechas.utils";

type TFBNotification = {
  title?: string;
  body?: string;
  image?: string;
};

type TFBMessage = {
  token?: string;

  notification: TFBNotification;
  data: Object;
  android?: {
    priority: string;
  };
};

export const defaultInicioOfertas = (
  token: string,
  nombre_juego: string,
  id_juego: number,
  fecha_fin: Date,
  tiempo_restante_seg: number
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: "Inicio de ofertas",
      body: `Se están recibiendo ofertas para el juego ${nombre_juego}. Tiene ${formatearTiempo(
        tiempo_restante_seg
      )} para poder realizar su oferta`,
    },
    data: {
      event: "inicio-ofertas",
      id_juego: id_juego.toString(),
      fecha_fin:
        fecha_fin.toLocaleDateString() + " " + fecha_fin.toLocaleTimeString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

// export const defaultInicioOfertas: TFBMessage = {
//   message: {
//     notification: {
//       title: "Tiempo de ofertas",
//       body: "¡El tiempo de ofertas ha iniciado!",
//     },

//     data: {
//       event: "inicio-ofertas",
//     },
//   },
// };
