import express from 'express';
import { body } from 'express-validator';
import {
  getAllPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona
} from '../controllers/personaController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createPersonaValidation = [
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
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];

const updatePersonaValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Persona name must not exceed 100 characters'),
  body('role')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role must not exceed 100 characters'),
  body('expertise')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one expertise area is required'),
  body('expertise.*')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each expertise area must be 1-50 characters'),
  body('mindset')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mindset description must be 10-1000 characters'),
  body('personality')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Personality description must be 10-1000 characters'),
  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be 10-500 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];

// Routes
router.get('/', optionalAuth, getAllPersonas); // Allow public access to view preset personas
router.get('/:id', optionalAuth, getPersonaById); // Allow public access to view specific personas
router.post('/', authenticate, createPersonaValidation, validate, createPersona);
router.put('/:id', authenticate, updatePersonaValidation, validate, updatePersona);
router.delete('/:id', authenticate, deletePersona);

export default router;