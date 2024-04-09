import { Router } from "express";
import {
  correosInvitados,
  crear,
  invitadosJuego,
  mostrarTodos,
  mostrarUno,
} from "../controllers/invitado.controllers";

class InvitadoRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Métodos exclusivos del modelo Invitados

    //Obtener todos los invitados
    this.router.get("/invitados", mostrarTodos);

    //Obtener los correos de todos los invitados
    this.router.get("/invitados/correos", correosInvitados);

    //Obtener un invitado por su identificador
    this.router.get("/invitados/:id", mostrarUno);

    //Métodos que incluyen los modelos Invitados, Juegos y Jugadores

    //Crear un invitado para un juego previamente creado
    this.router.post("/jugadores/juegos/:idjuego/invitados", crear);

    //Obtener los invitados de un juego
    this.router.get("/jugadores/juegos/:idjuego/invitados", invitadosJuego);
  }
}

export default new InvitadoRoutes().router;
