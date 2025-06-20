import express from 'express';
import * as CashBuyersController from '../controllers/cashbuyers.controller';
import { protectAuth } from '../middleware/auth-middleware';

const router = express.Router();

// Create cash buyer submission (public endpoint - no auth required)
router.post('/submission', CashBuyersController.createCashBuyerSubmission);

// Search and get list of cash buyers
router.get('/list', protectAuth, CashBuyersController.searchCashBuyers);

// Get single cash buyer details
router.get('/:id', protectAuth, CashBuyersController.getCashBuyer);

// Save cash buyer to user favorites
router.post('/:id/save', protectAuth, CashBuyersController.saveCashBuyer);

// Remove cash buyer from user favorites
router.delete('/:id/save', protectAuth, CashBuyersController.unsaveCashBuyer);

// Get list of user's saved cash buyers
router.get('/saved/list', protectAuth, CashBuyersController.getSavedCashBuyers);

export default router;