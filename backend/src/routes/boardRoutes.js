import express from 'express';
import { body } from 'express-validator';
import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  addPersonaToBoard,
  removePersonaFromBoard
} from '../controllers/boardController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createBoardValidation = [
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
  body('personaIds')
    .optional()
    .isArray()
    .withMessage('personaIds must be an array'),
  body('personaIds.*')
    .isString()
    .withMessage('Each persona ID must be a string')
];

const updateBoardValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Board name must not exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),
  body('personaIds')
    .optional()
    .isArray()
    .withMessage('personaIds must be an array'),
  body('personaIds.*')
    .isString()
    .withMessage('Each persona ID must be a string')
];

const addPersonaValidation = [
  body('personaId')
    .notEmpty()
    .isString()
    .withMessage('Persona ID is required and must be a string')
];

// Routes
router.get('/', authenticate, getBoards);
router.get('/:id', authenticate, getBoard);
router.post('/', authenticate, createBoardValidation, validate, createBoard);
router.put('/:id', authenticate, updateBoardValidation, validate, updateBoard);
router.delete('/:id', authenticate, deleteBoard);
router.post('/:id/personas', authenticate, addPersonaValidation, validate, addPersonaToBoard);
router.delete('/:id/personas/:personaId', authenticate, removePersonaFromBoard);

export default router;