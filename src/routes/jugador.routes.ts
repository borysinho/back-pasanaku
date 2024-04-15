import { Router } from "express";
import { validateResult } from "../validations/result.validate";
import {
  validarCorreoBody,
  validarIdParam,
  validarNombreBody,
  validarTelfBody,
  validarNoExisteEmailJugador,
  validarNoExisteIdJugador,
  validarNoExisteTelfJugador,
  validarExisteTelefonoOpcional,
  validarExisteCorreoOpcional,
} from "../validations/jugador.validation";

import jugadorController from "../controllers/jugador.controllers";

class JugadorRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/jugadores", jugadorController.mostrarTodos);
    this.router.get(
      "/jugadores/validar",
      jugadorController.buscarUsuarioDeJugador
    );
    this.router.get(
      "/jugadores/:id",
      // validarIdParam,
      // validarNoExisteIdJugador,
      // validateResult,
      jugadorController.mostrarUno
    );

    this.router.post(
      "/jugadores",
      //TODO corregir las validaciones de crear jugador
      // validarNombreBody,
      // validarCorreoBody,
      // validarTelfBody,
      // validarNoExisteEmailJugador,
      // validarNoExisteTelfJugador,
      // validateResult,
      jugadorController.crearConInvitacion
    );

    this.router.post(
      "/jugadores/norelacionar",
      jugadorController.crearSinInvitacion
    );

    this.router.put(
      "/jugadores/:id",
      // validarIdParam,
      // validarExisteTelefonoOpcional,
      // validarExisteCorreoOpcional,
      // validateResult,
      jugadorController.actualizar
    );

    this.router.delete(
      "/jugadores/:id",
      // validarIdParam,
      // validarNoExisteIdJugador,
      // validateResult,
      jugadorController.eliminar
    );
  }
}

export default new JugadorRoutes().router;
