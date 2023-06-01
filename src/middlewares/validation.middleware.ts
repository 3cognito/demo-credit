import { NextFunction, Request, Response } from "express";

class ValidationMiddleware {
  static validateBody(schemaClass: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const schema = new schemaClass();
      const validationResult = schema.validate(req.body);

      if (validationResult.error) {
        const errorMessage = validationResult.error.details[0].message;
        const cleanedErrorMessage = errorMessage.replaceAll('"', "");
        return res.status(400).json({ status: "Validation Error", message: cleanedErrorMessage });
      }

      next();
    };
  }
}

export default ValidationMiddleware;
