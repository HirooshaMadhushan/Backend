import {body,validationResult} from 'express-validator';

export const registerValidator=[
    body('name').notEmpty().withMessage('Name is required').isLength({min:3}).withMessage('Name must be at least 3 characters long'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
    .isLength({min:6}).withMessage('Password must be at least 6 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
     body("phone").optional().isLength({ min: 10 }).withMessage("Invalid phone number"),
  body("role").optional().isIn(["ADMIN", "CUSTOMER", "STAFF"]).withMessage("Invalid role"),
]

export const loginValidator=[
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
]
;