import { Application } from "express";
import jugadorRouter from "./jugador.routes";
import juegoRouter from "./juego.routes";
import invitadoRoutes from "./invitado.routes";
import notificacionRoutes from "./notificacion.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", jugadorRouter);
    app.use("/api", juegoRouter);
    app.use("/api", invitadoRoutes);
    app.use("/api", notificacionRoutes);
  }
}
