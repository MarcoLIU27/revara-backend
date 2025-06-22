import express from 'express';
import * as AuthController from '../controllers/auth.controller';
import { protectAuth } from '../middleware/auth-middleware';
const router = express.Router();

// Access: public
// POST: login
// Params body: username, password
router.post('/login', AuthController.validateLoginData, AuthController.login);

// Access: public
// POST: signup
// Params body: fullName, username, email, password
router.post('/signup', AuthController.validateSignupData, AuthController.signup);

// Access: Private
// POST: logout
router.post('/logout', protectAuth, AuthController.logout);

// Access: Private
// GET: me - get current user info
router.get('/me', protectAuth, AuthController.me);

// Access: Private
// POST: refresh-token - refresh JWT token
router.post('/refresh-token', protectAuth, AuthController.refreshToken);

// Access: Private
// POST: change-password
// Params body: currentPassword, newPassword
router.post('/change-password', protectAuth, AuthController.changePassword);

export default router;
