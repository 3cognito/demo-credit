import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import AuthController from "../controllers/auth.controller";
import { CreateUserDto, UserLoginDto } from "../dtos/user.dtos";
import ValidationMiddleware from "../middlewares/validation.middleware";

class AuthRoute implements Routes {
  public path = "/auth/";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}register`, ValidationMiddleware.validateBody(CreateUserDto), this.authController.register);
    this.router.post(`${this.path}login`, ValidationMiddleware.validateBody(UserLoginDto), this.authController.login);
  }
}

export default AuthRoute;
