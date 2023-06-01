import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import WalletController from "../controllers/wallet.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { FundWalletDto, TransferFundsDto, WithdrawFundsDto } from "../dtos/wallet.dtos";
import ValidationMiddleware from "../middlewares/validation.middleware";

class WalletRoute implements Routes {
  public path = "/wallet/";
  public router = Router();
  public walletController = new WalletController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);
    this.router.get(`${this.path}`, this.walletController.getWallet);
    this.router.post(`${this.path}fund`, ValidationMiddleware.validateBody(FundWalletDto), this.walletController.fundWallet);
    this.router.post(`${this.path}withdraw`, ValidationMiddleware.validateBody(WithdrawFundsDto), this.walletController.withdrawFunds);
    this.router.post(`${this.path}transfer`, ValidationMiddleware.validateBody(TransferFundsDto), this.walletController.transferFunds);
    this.router.get(`${this.path}transactions`, this.walletController.fetchTransactions);
  }
}

export default WalletRoute;
