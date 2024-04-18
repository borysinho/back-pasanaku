import { Router } from "express";
import invitadoController from "../controllers/invitado.controllers";

class InvitadoRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Métodos exclusivos del modelo Invitados

    //Obtener todos los invitados
    this.router.get("/invitados", invitadoController.mostrarTodos);

    //Obtener invitados a partir del correo y del teléfono
    this.router.get(
      "/invitados/validar",
      invitadoController.validarDatosInvitado
    );

    //Obtener los correos de todos los invitados
    this.router.get("/invitados/correos", invitadoController.correosInvitados);

    //Obtener un invitado por su identificador
    this.router.get("/invitados/:id", invitadoController.mostrarUno);

    //Métodos que incluyen los modelos Invitados, Juegos y Jugadores

    //Crear un invitado para un juego previamente creado
    this.router.post(
      "/jugadores/juegos/:idjuego/invitados",
      invitadoController.crear
    );

    //Obtener los invitados de un juego
    this.router.get(
      "/jugadores/juegos/:idjuego/invitados",
      invitadoController.invitadosJuego
    );

    this.router.post(
      "/jugadores/:id_jugador/juegos/:id_juego/invitados/:id_invitado",
      invitadoController.aceptarInvitacionDeJuego
    );
  }
}

export default new InvitadoRoutes().router;
