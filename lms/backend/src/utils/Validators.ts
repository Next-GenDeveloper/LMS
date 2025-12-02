import type { ValidationChain } from 'express-validator';
import ev from 'express-validator';
const { body, validationResult } = ev as unknown as {
  body: typeof import('express-validator').body;
  validationResult: typeof import('express-validator').validationResult;
};
import type { Request, Response, NextFunction } from 'express';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }
    next();
  };
};

export const signupValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('fullName').notEmpty().trim(),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const courseValidation = [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('category').notEmpty(),
  body('price').isFloat({ min: 0 }),
];

export const enrollmentValidation = [
  body('courseId').notEmpty(),
];