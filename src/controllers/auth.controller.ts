import { CreateUserDto, UserLoginDto } from "../dtos/user.dtos";
import { User } from "../interfaces/user.interface";
import AuthService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import { ServerResponse } from "../utils/serverResponse";

class AuthController {
  public authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const newUser: User = await this.authService.register(userData);
      ServerResponse(req, res, 201, newUser, "User created successfully");
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: UserLoginDto = req.body;
      const { token, user } = await this.authService.login(userData);
      ServerResponse(req, res, 200, { token, user }, "Login successful");
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
