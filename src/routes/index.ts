import { Application } from "express";
import jugadorRouter from "./jugador.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", jugadorRouter);
  }
}
