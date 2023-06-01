import Joi from "joi";

export class CreateUserDto {
  email: string;
  password: string;
  private schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  validate(data: any) {
    return this.schema.validate(data);
  }
}

export class UserLoginDto {
  email: string;
  password: string;
  private schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  validate(data: any) {
    return this.schema.validate(data);
  }
}
