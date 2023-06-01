import { hashSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { CreateUserDto, UserLoginDto } from "../dtos/user.dtos";
import { HttpException } from "../exceptions/HttpExceptions";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import { Users } from "../models/users.model";

class AuthService {
  public async register(userData: CreateUserDto): Promise<User> {
    const existingUser: User = await Users.query().select().from("users").where({ email: userData.email, deleted: false }).first();
    if (existingUser) throw new HttpException(409, "User already exists with this email");
    const user: User = await Users.query().insertAndFetch({ ...userData, password: hashSync(userData.password, 10) });
    return user;
  }

  public async login(userData: UserLoginDto): Promise<{ token: TokenData; user: User }> {
    const user: User = await Users.query().select().from("users").where({ email: userData.email, deleted: false }).first();
    if (!user || !user.password || !compareSync(userData.password, user.password)) throw new HttpException(409, "Invalid login credentials");
    const token = this.createToken(user);
    return { token, user };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}

export default AuthService;
