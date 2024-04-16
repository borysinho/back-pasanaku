import { Router } from "express";
import authController from "../controllers/auth.token.controller";

class AuthToken {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/login", authController.login);
    this.router.get("/login/validar", authController.validarToken);
  }
}

export default new AuthToken().router;
