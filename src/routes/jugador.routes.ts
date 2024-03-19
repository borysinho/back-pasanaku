import { Router } from "express";
import {
  actualizar,
  eliminar,
  crear,
  mostrar,
  // correo,
} from "../controllers/jugador.controller";

class JugadorRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/jugadores", mostrar);
    this.router.post("/jugadores", crear);
    this.router.put("/jugadores/:id", actualizar);
    this.router.delete("/jugadores/:id", eliminar);
    // this.router.get("/correo", correo);
  }
}

export default new JugadorRoutes().router;
