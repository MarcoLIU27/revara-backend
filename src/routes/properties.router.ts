import express from 'express';
import * as PropertiesController from '../controllers/properties.controller';
import { isAdmin, protectAuth } from '../middleware/auth-middleware';

const router = express.Router();

router.get('/list', PropertiesController.searchProperties);

router.get('/:id', protectAuth, PropertiesController.getProperty);

// Find comparable properties
router.get('/:id/comparable', protectAuth, PropertiesController.findComparableProperties);

router.delete('/:id', protectAuth, isAdmin, PropertiesController.deleteProperty);

// Save property to user favorites
router.post('/:id/save', protectAuth, PropertiesController.saveProperty);

// Remove property from user favorites
router.delete('/:id/save', protectAuth, PropertiesController.unsaveProperty);

// Get list of user's saved properties
router.get('/saved/list', protectAuth, PropertiesController.getSavedProperties);

export default router; 