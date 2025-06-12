import express from 'express';
import * as PropertiesController from '../controllers/properties.controller';

const router = express.Router();

router.get('/list', PropertiesController.searchProperties);

router.get('/:id', PropertiesController.getProperty);

export default router; 