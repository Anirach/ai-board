import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array()); // Add logging
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Board validation rules
export const validateBoard = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Board name is required and must not exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),
];

// Persona validation rules
export const validatePersona = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Persona name is required and must not exceed 100 characters'),
  body('role')
    .isLength({ min: 1, max: 100 })
    .withMessage('Role is required and must not exceed 100 characters'),
  body('expertise')
    .isArray({ min: 1 })
    .withMessage('At least one expertise area is required'),
  body('expertise.*')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each expertise area must be 1-50 characters'),
  body('mindset')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mindset description must be 10-1000 characters'),
  body('personality')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Personality description must be 10-1000 characters'),
  body('description')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be 10-500 characters'),
];

// Conversation validation rules
export const validateConversation = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Conversation title is required and must not exceed 200 characters'),
  body('context')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Context cannot exceed 1000 characters'),
  body('boardId')
    .notEmpty()
    .withMessage('Board ID is required'),
];

// Message validation rules
export const validateMessage = [
  body('content')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content is required and must not exceed 5000 characters'),
  body('type')
    .isIn(['USER', 'PERSONA', 'SYSTEM'])
    .withMessage('Message type must be USER, PERSONA, or SYSTEM'),
];