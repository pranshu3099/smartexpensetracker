import z from "zod";
import express, { NextFunction } from "express";

interface ValidationResult {
  success: boolean;
  error?: {
    issues: {
      message: string;
      path: string;
    }[];
  };
}
type Schema = {
  body: any;
};

const validate =
  (obj: Schema) =>
  (req: express.Request, res: express.Response, next: NextFunction) => {
    const validations: ValidationResult[] = [];
    let keys = Object.keys(obj) as Array<keyof Schema>;
    keys.forEach((key) => {
      const requestObject = req[key] || {};
      validations.push((obj as any)[key].safeParse(requestObject));
    });
    const failures = validations.filter((v) => !v.success);
    if (failures.length) {
      const errors = failures.map((f) => {
        let err = f?.error;
        let issues = err?.issues;
        let validationerr = issues?.map((i) => ({
          message: i.message,
          path: i.path,
        }));

        return validationerr;
      });

      return res.status(400).send(errors);
    }

    next();
  };

export default validate;
