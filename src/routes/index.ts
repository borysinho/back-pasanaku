import { Application } from "express";
import jugadorRouter from "./jugador.routes";
import juegoRouter from "./juego.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", jugadorRouter);
    app.use("/api", juegoRouter);
  }
}
