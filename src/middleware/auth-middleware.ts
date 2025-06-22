import * as UserService from '../services/user.service';
import { NextFunction, Request, Response } from 'express';
import { sendBadRequestResponse } from '../utils/responseHandler';
import { verifyToken } from '../utils/jwtHandler';

const protectAuth = async (request: Request, response: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    try {
      const decoded = verifyToken(token);
      const authUser = await UserService.getUserByID(decoded.id);
      if (authUser?.username) {
        request.user = authUser;
      }
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return sendBadRequestResponse(response, 'Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        return sendBadRequestResponse(response, 'Invalid token');
      }
      next(error);
    }
  } else {
    return sendBadRequestResponse(response, 'Unauthorized - you need to login');
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return sendBadRequestResponse(res, 'Unauthorized - user not found');
  }

  // Check if user has admin role
  if ((user as any).role !== 'ADMIN') {
    return sendBadRequestResponse(res, 'Forbidden - admin access only');
  }

  next();
};

export { protectAuth, isAdmin };
