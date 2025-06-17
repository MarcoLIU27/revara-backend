import * as UserService from '../services/user.service';
import { NextFunction, Request, Response } from 'express';
import { sendBadRequestResponse } from '../utils/responseHandler';
import { verifyToken } from '../utils/jwtHandler';

const protectAuth = async (request: Request, response: Response, next: NextFunction) => {
  const allCookies = request.cookies;
  const token = allCookies.jwt;
  if (token) {
    try {
      const decoded = verifyToken(token);
      const authUser = await UserService.getUserByID(decoded.id);
      if (authUser?.username) {
        request.user = authUser;
      }
      next();
    } catch (error: any) {
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
