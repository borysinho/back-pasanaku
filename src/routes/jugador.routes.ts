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

import {
  actualizar,
  eliminar,
  crearSinInvitacion,
  crearConInvitacion,
  mostrarTodos,
  mostrarUno,
} from "../controllers/jugador.controllers";

class JugadorRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/jugadores", mostrarTodos);
    this.router.get(
      "/jugadores/:id",
      validarIdParam,
      validarNoExisteIdJugador,
      validateResult,
      mostrarUno
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
      crearConInvitacion
    );

    this.router.post("/jugadores/norelacionar", crearSinInvitacion);

    this.router.put(
      "/jugadores/:id",
      validarIdParam,
      validarExisteTelefonoOpcional,
      validarExisteCorreoOpcional,
      validateResult,
      actualizar
    );

    this.router.delete(
      "/jugadores/:id",
      validarIdParam,
      validarNoExisteIdJugador,
      validateResult,
      eliminar
    );
  }
}

export default new JugadorRoutes().router;
