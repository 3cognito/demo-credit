import dotenv from "dotenv";
import { Config } from "../interfaces/config.interface";

dotenv.config();

class Env implements Config {
  NODE_ENV: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  SECRET_KEY: string;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || "development";
    this.PORT = Number(process.env.PORT)!;
    this.DB_HOST = process.env.DB_HOST!;
    this.DB_NAME = process.env.DB_NAME!;
    this.DB_PASSWORD = process.env.DB_PASSWORD!;
    this.DB_USER = process.env.DB_USER!;
    this.SECRET_KEY = process.env.SECRET_KEY!;
    this.DB_PORT = Number(process.env.DB_PORT)!;
  }

  getAll(): Config {
    const env = process.env.NODE_ENV || "development";

    switch (env) {
      case "production":
        return this.getProduction();
      case "test":
        return this.getTest();
      case "development":
        return this.getDevelopment();
      default:
        return this.getDefault();
    }
  }

  getDefault(): Config {
    return {
      NODE_ENV: this.NODE_ENV,
      PORT: this.PORT,
      DB_HOST: this.DB_HOST,
      DB_NAME: this.DB_NAME,
      DB_PASSWORD: this.DB_PASSWORD,
      DB_USER: this.DB_USER,
      DB_PORT: this.DB_PORT,
      SECRET_KEY: this.SECRET_KEY,
    };
  }
  getProduction() {
    return { ...this.getDefault() };
  }
  getDevelopment() {
    return { ...this.getDefault() };
  }
  getTest(): Config {
    return {
      ...this.getDefault(),
    };
  }
}

export const { NODE_ENV, PORT, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, SECRET_KEY } = new Env().getAll();
