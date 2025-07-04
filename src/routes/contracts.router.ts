import express from 'express';
import * as ContractsController from '../controllers/contracts.controller';
import { protectAuth } from '../middleware/auth-middleware';

const router = express.Router();

// Generate PDF Contract
// Access: Private
// POST: Generate PDF Contract
router.post('/generate', protectAuth, ContractsController.generateContract);

// Health Check
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

export default router; 