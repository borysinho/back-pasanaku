import { Router } from "express";
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
    this.router.get("/jugadores/:id", jugadorController.mostrarUno);

    this.router.post("/jugadores", jugadorController.crearConInvitacion);

    this.router.post(
      "/jugadores/norelacionar",
      jugadorController.crearSinInvitacion
    );

    this.router.put("/jugadores/:id", jugadorController.actualizar);

    this.router.delete("/jugadores/:id", jugadorController.eliminar);
  }
}

export default new JugadorRoutes().router;
