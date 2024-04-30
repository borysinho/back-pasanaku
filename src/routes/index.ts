import { Application } from "express";
import jugadorRouter from "./jugador.routes";
import juegoRouter from "./juego.routes";
import invitadoRoutes from "./invitado.routes";
import notificacionRoutes from "./notificacion.routes";
import authTokenRoutes from "./auth.token.routes";
import turnoRouter from "./turno.routes";
import pagosRouter from "./pagos.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", jugadorRouter);
    app.use("/api", juegoRouter);
    app.use("/api", invitadoRoutes);
    app.use("/api", notificacionRoutes);
    app.use("/api", authTokenRoutes);
    app.use("/api", turnoRouter);
    app.use("/api", pagosRouter);
  }
}
