import { NextFunction, Response } from "express";
import walletService from "../services/wallet.service";
import { Wallet } from "../interfaces/wallet.interface";
import { RequestWithUser } from "../interfaces/auth.interface";
import { Transaction } from "../interfaces/transaction.interface";
import { FundWalletDto, TransferFundsDto, WithdrawFundsDto } from "../dtos/wallet.dtos";
import { ServerResponse } from "../utils/serverResponse";

class WalletController {
  public walletService = new walletService();

  getWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wallet: Wallet = await this.walletService.fetchWallet(req.user);
      ServerResponse(req, res, 200, wallet, "Wallet retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  fundWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: FundWalletDto = req.body;
      const wallet: Wallet = await this.walletService.fundWallet(req.user, payload);
      ServerResponse(req, res, 200, wallet, "Funding successful");
    } catch (error) {
      next(error);
    }
  };

  withdrawFunds = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: WithdrawFundsDto = req.body;
      const wallet: Wallet = await this.walletService.withdrawFunds(req.user, payload);
      ServerResponse(req, res, 200, wallet, "Withdrawal successful");
    } catch (error) {
      next(error);
    }
  };

  transferFunds = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: TransferFundsDto = req.body;
      const wallet: Wallet = await this.walletService.transferFunds(req.user, payload);
      ServerResponse(req, res, 200, wallet, "Transfer successful");
    } catch (error) {
      next(error);
    }
  };

  fetchTransactions = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactions: Transaction[] = await this.walletService.fetchTransactions(req.user);
      ServerResponse(req, res, 200, transactions, "Transaction history fetched sucessfully");
    } catch (error) {
      next(error);
    }
  };
}

export default WalletController;
