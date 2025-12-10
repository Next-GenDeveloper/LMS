import * as expressValidator from 'express-validator';
const { body, validationResult } = expressValidator as any;
import type { Request, Response, NextFunction } from 'express';
type ValidationChain = any;

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
      }
    }
    next();
  };
};

export const strongPassword = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter')
  .matches(/[a-z]/).withMessage('Password must include at least one lowercase letter')
  .matches(/[0-9]/).withMessage('Password must include at least one digit')
  .matches(/[^A-Za-z0-9]/).withMessage('Password must include at least one special character');

export const signupValidation = [
  body('email').isEmail().normalizeEmail(),
  strongPassword,
  body('fullName').notEmpty().trim(),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().isLength({ min: 8 }).withMessage('Invalid password'),
];

export const changePasswordValidation = [
  body('currentPassword').optional().isLength({ min: 8 }),
  strongPassword.withMessage('New password does not meet complexity requirements').bail(),
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

export const userProfileValidation = [
  body('firstName').optional().isLength({ min: 1, max: 50 }).trim().escape(),
  body('lastName').optional().isLength({ min: 1, max: 50 }).trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('bio').optional().isLength({ max: 500 }).trim().escape(),
  body('phone').optional().isMobilePhone('any').trim(),
  body('profilePicture').optional().isURL().trim(),
  body('preferences.interests').optional().isArray(),
  body('preferences.interests.*').optional().isLength({ max: 50 }).trim().escape(),
  body('preferences.preferredLanguage').optional().isIn(['en', 'ur', 'hi']),
  body('preferences.notifications').optional().isBoolean(),
];