import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import hpp from "hpp";
import { Model } from "objection";
import { NODE_ENV, PORT } from "../src/config";
import knex from "../src/databases";
import { Routes } from "../src/interfaces/routes.interface";
import errorMiddleware from "../src/middlewares/errors.middleware";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;

    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.app.listen(this.port);
  }

  public listen() {
    return this.app;
  }

  private initializeDatabase() {
    Model.knex(knex);
    console.log("DB connection successful");
  }

  private initializeMiddlewares() {
    this.app.use(cors({ origin: "*", credentials: true }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
    this.app.use((req: Request, res: Response) => res.status(404).send({ status: "error", message: `${req.method} ${req.originalUrl} Not Found` }));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
