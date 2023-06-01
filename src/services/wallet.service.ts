import { User } from "../interfaces/user.interface";
import { Wallets } from "../models/wallets.model";
import { Wallet } from "../interfaces/wallet.interface";
import { FundWalletDto, TransferFundsDto, WithdrawFundsDto } from "../dtos/wallet.dtos";
import { raw } from "objection";
import { Transactions } from "../models/transactions.model";
import { HttpException } from "../exceptions/HttpExceptions";
import { Users } from "../models/users.model";
import { Transfers } from "../models/transfers.model";
import { Transaction } from "../interfaces/transaction.interface";

class WalletService {
  async fetchWallet(user: User): Promise<Wallets> {
    let wallet: Wallets = await Wallets.query().findOne({ userId: user.id, deleted: false });
    !wallet ? (wallet = await Wallets.query().insertAndFetch({ userId: user.id, balance: 0 })) : null;
    return wallet;
  }

  private async fetchUserByEmail(email: string): Promise<User> {
    const user: User = await Users.query().findOne({ email, deleted: false });
    if (!user) throw new HttpException(400, "Account not found");
    return user;
  }

  async fundWallet(user: User, payload: FundWalletDto): Promise<Wallet> {
    const trx = await Wallets.startTransaction();
    try {
      let wallet: Wallets = await this.fetchWallet(user);
      const transaction: Transactions = await Transactions.query(trx).insertAndFetch({
        userId: user.id,
        direction: "credit",
        type: "fund",
        status: "pending",
        amount: +payload.amount,
      });
      wallet = await wallet.$query(trx).patchAndFetch({ balance: raw("balance + :amount", { amount: +payload.amount }) });

      await transaction.$query(trx).patchAndFetch({ status: "success" });
      await trx.commit();
      return wallet;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(500, "Error funding wallet");
    }
  }

  async withdrawFunds(user: User, payload: WithdrawFundsDto): Promise<Wallet> {
    const trx = await Wallets.startTransaction();
    try {
      let wallet: Wallets = await this.fetchWallet(user);
      const transaction: Transactions = await Transactions.query(trx).insertAndFetch({
        userId: user.id,
        direction: "debit",
        type: "withdraw",
        status: "pending",
        amount: +payload.amount,
      });
      wallet = await wallet
        .$query(trx)
        .patchAndFetch({ balance: raw("balance - :amount", { amount: +payload.amount }) })
        .where("balance", ">=", +payload.amount);
      if (!wallet) {
        await trx.rollback();
        throw new HttpException(400, "Insufficient balance");
      }

      await transaction.$query(trx).patchAndFetch({ status: "success" });
      await trx.commit();
      return wallet;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(400, error.message || "Error withdrawing funds");
    }
  }

  async transferFunds(user: User, payload: TransferFundsDto): Promise<Wallet> {
    const trx = await Wallets.startTransaction();
    try {
      if (payload.email === user.email) throw new HttpException(400, "Cannot transfer to yourself");

      const destination: User = await this.fetchUserByEmail(payload.email);
      let wallet: Wallets = await this.fetchWallet(user);
      const transaction: Transactions = await Transactions.query(trx).insertAndFetch({
        userId: user.id,
        direction: "debit",
        type: "transfer",
        status: "pending",
        amount: +payload.amount,
      });
      wallet = await wallet
        .$query(trx)
        .patchAndFetch({ balance: raw("balance - :amount", { amount: +payload.amount }) })
        .where("balance", ">=", +payload.amount);
      if (!wallet) {
        await trx.rollback();
        throw new HttpException(400, "Insufficient Balance");
      }
      await transaction.$query(trx).patchAndFetch({ status: "success" });

      const destinationWallet: Wallets = await this.fetchWallet(destination);
      const destinationTransaction: Transactions = await Transactions.query(trx).insertAndFetch({
        userId: destination.id,
        direction: "credit",
        type: "transfer",
        status: "pending",
        amount: +payload.amount,
      });
      await destinationWallet.$query(trx).patchAndFetch({ balance: raw("balance + :amount", { amount: +payload.amount }) });
      await destinationTransaction.$query(trx).patchAndFetch({ status: "success" });

      await Transfers.query(trx).insertAndFetch({ sourceTransactionId: transaction.id, destinationTransactionId: destinationTransaction.id });

      await trx.commit();
      return wallet;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(400, error.message || "Error transfering funds");
    }
  }

  async fetchTransactions(user: User): Promise<Transaction[]> {
    const transactions: Transaction[] = await Transactions.query()
      .where({ userId: user.id, deleted: false })
      .withGraphFetched({
        transferSource: { destination: { user: true } },
        transferDestination: { source: { user: true } },
      });
    return transactions;
  }
}

export default WalletService;
