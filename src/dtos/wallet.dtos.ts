import Joi from "joi";

export class FundWalletDto {
  amount: number;
  private schema = Joi.object({
    amount: Joi.number().required().min(0.01),
  });

  validate(data: any) {
    return this.schema.validate(data);
  }
}

export class WithdrawFundsDto {
  amount: number;
  private schema = Joi.object({
    amount: Joi.number().required().min(0.01),
  });

  validate(data: any) {
    return this.schema.validate(data);
  }
}

export class TransferFundsDto {
  amount: number;
  email: string;
  private schema = Joi.object({
    amount: Joi.number().required().min(0.01),
    email: Joi.string().email().required(),
  });

  validate(data: any) {
    return this.schema.validate(data);
  }
}
