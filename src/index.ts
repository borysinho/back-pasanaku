import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import "dotenv/config";
import Routes from "./routes";
import { errorMiddleware } from "./middlewares";

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
    this.setErrorMiddleware(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: `http://localhost:${process.env.WS_PORT || 3000}`,
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private setErrorMiddleware(app: Application): void {
    app.use(errorMiddleware);
  }
}
