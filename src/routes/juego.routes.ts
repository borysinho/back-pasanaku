import { Router } from "express";
import { validateResult } from "../validations/result.validate";
import {
  actualizarJuegoDeCreador,
  crear,
  eliminarJuegoDeCreador,
  obtenerJuegosDeCreador,
  obtenerJuegosDeTodosLosJugadores,
} from "../controllers/juego.controllers";
import {
  validarExisteFecha_InicioOpcional,
  validarExisteMoneda,
  validarExisteMontoTotal,
  validarExisteNombreOpcional,
  validarFecha_InicioBody,
  validarMontoTotalBody,
  validarNombreBody,
} from "../validations/juego.validation";
import {
  validarIdParam,
  validarNoExisteIdJugador,
} from "../validations/jugador.validation";

class JuegoRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/juegos", obtenerJuegosDeTodosLosJugadores);
    this.router.get(
      "/jugadores/juegos/:id",
      validarIdParam,
      validarNoExisteIdJugador,
      validateResult,
      obtenerJuegosDeCreador
    );

    this.router.post(
      "/jugadores/:id/juegos",
      validarFecha_InicioBody,
      validarNombreBody,
      validarMontoTotalBody,
      validarIdParam,
      validarNoExisteIdJugador,
      validateResult,
      crear
    );

    this.router.put(
      "/jugadores/:id/juegos",
      validarIdParam,
      validarNoExisteIdJugador,
      validarExisteNombreOpcional,
      validarExisteFecha_InicioOpcional,
      validarExisteMontoTotal,
      validarExisteMoneda,
      validateResult,
      actualizarJuegoDeCreador
    );

    this.router.delete(
      "/jugadores/:id/juegos",
      validarIdParam,
      validarNoExisteIdJugador,
      // TODO Validar que el ID de juego corresponda al jugador que pretende eliminar
      validateResult,
      eliminarJuegoDeCreador
    );
  }
}

export default new JuegoRoutes().router;
