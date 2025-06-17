import express from 'express';
import * as PropertiesController from '../controllers/properties.controller';
import { isAdmin, protectAuth } from '../middleware/auth-middleware';

const router = express.Router();

router.get('/list', PropertiesController.searchProperties);

router.get('/:id', protectAuth, PropertiesController.getProperty);

router.delete('/:id', protectAuth, isAdmin, PropertiesController.deleteProperty);

export default router; 