import express, { Application } from "express";
import Server from "./src/index";

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = process.env.WS_PORT
  ? parseInt(process.env.WS_PORT, 10)
  : 3000;

app
  .listen(PORT, "localhost", () => {
    console.log(`Server escuchando en puerto ${PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: la dirección se encuentra en uso");
    } else {
      console.log(err);
    }
  });
