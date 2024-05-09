import { Router } from "express";
import multasController from "../controllers/multa.controllers";
// import notificacionesController from "../controllers/notificacion.controllers";

class MultasRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  // Ruta exclusiva para el modelo pagosTurnos

  initializeRoutes() {
    // Obtenemos todas las multas de un jugador_juego en un juego
    this.router.get(
      "/jugadores_juegos/:id_jugador_juego/solicitudpagomulta/pagos/turnos/juegos/:id_juego",
      multasController.ctrlGetPagosMultas
    );

    // Obtenemos un pagoTurno por id
    this.router.get(
      "/jugadores_juegos/solicitudpagomulta/:id_solicitud_pago_multa/pagos/turnos/:id_turno/juegos",
      multasController.ctrlGetPagosMultasById
    );

    // Registramos un pagoTurno a partir de una solicitud de pago de multa en un turno
    this.router.post(
      "/jugadores_juegos/solicitudpagomulta/:id_solicitud_pago_multa/pagos/turnos/:id_turno/juegos",
      multasController.ctrlCreatePagosMultas
    );

    // Actualizamos un pagoTurno a partir de una solicitud de pago de multa en un turno
    this.router.put(
      "/jugadores_juegos/solicitudpagomulta/:id_solicitud_pago_multa/pagos/turnos/:id_turno/juegos",
      multasController.ctrlUpdatePagosMultas
    );
    this.router.delete(
      "/jugadores_juegos/solicitudpagomulta/:id_solicitud_pago_multa/pagos/turnos/:id_turno/juegos",
      multasController.ctrlDeletePagosMultas
    );
  }
}

export default new MultasRoutes().router;
