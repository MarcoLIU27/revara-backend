import * as UserService from '../services/user.service';
import { NextFunction, Request, Response } from 'express';
import { TUserSchema, userSchema, userSignupSchema } from '../types/zod';
import { sendSuccessNoDataResponse, sendSuccessResponse, sendUnauthorizedResponse } from '../utils/responseHandler';
import { comparePasswords, hashPassword } from '../utils/bcryptHandler';
import { generateToken } from '../utils/jwtHandler';

export const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userRequest: TUserSchema = request.body;
    const user = await UserService.getUserByEmail(userRequest.email);

    if (!user) {
      return sendUnauthorizedResponse(response, 'User not found');
    }

    const passwordCompare = await comparePasswords(userRequest.password, user.password);

    if (passwordCompare) {
      const token = generateToken({ id: user.id }, '30d');

      const responseData = {
        token,
        user: {
          fullName: user.full_name,
          username: user.username,
          email: user.email,
        }
      };
      return sendSuccessResponse(response, responseData);
    } else {
      return sendUnauthorizedResponse(response, 'Password is incorrect');
    }
  } catch (error: any) {
    next(error);
  }
};

export const signup = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { fullName, username, email, password } = request.body;

    // Check if user already exists
    const existingUser = await UserService.getUserByUsername(username);
    if (existingUser) {
      return sendUnauthorizedResponse(response, 'Username already exists');
    }

    // Check if email already exists
    const existingEmail = await UserService.getUserByEmail(email);
    if (existingEmail) {
      return sendUnauthorizedResponse(response, 'Email already exists');
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser = await UserService.createUser({
      fullName,
      username,
      email,
      password: hashedPassword
    });

    const responseData = {
      fullName: newUser.full_name,
      username: newUser.username,
      email: newUser.email,
    };

    return sendSuccessResponse(response, responseData);
  } catch (error: any) {
    next(error);
  }
};

export const logout = async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Since we use token authentication, client needs to delete token themselves
    // Here we just return success message
    return sendSuccessNoDataResponse(response, 'Logged out successfully');
  } catch (error: any) {
    next(error);
  }
};

export const me = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.user;

    if (!user) {
      return sendUnauthorizedResponse(response, 'User not found');
    }

    const userData = {
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      email: user.email,
      role: (user as any).role || 'USER'
    };

    return sendSuccessResponse(response, userData);
  } catch (error: any) {
    next(error);
  }
};

export const changePassword = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = request.body;
    const user = request.user;

    if (!user) {
      return sendUnauthorizedResponse(response, 'User not found');
    }

    const fullUser = await UserService.getUserByID(user.id);
    if (!fullUser) {
      return sendUnauthorizedResponse(response, 'User not found');
    }

    // Check if old password is correct
    const passwordCompare = await comparePasswords(oldPassword, fullUser.password);
    if (!passwordCompare) {
      return sendUnauthorizedResponse(response, 'Old password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);

    await UserService.updateUserByID(user.id, {
      password: hashedPassword
    });

    return sendSuccessNoDataResponse(response, 'Password updated successfully');
  } catch (error: any) {
    next(error);
  }
};

export const refreshToken = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.user;

    if (!user) {
      return sendUnauthorizedResponse(response, 'User not found');
    }

    const newToken = generateToken({ id: user.id }, '30d');

    const responseData = {
      token: newToken,
      user: {
        fullName: user.full_name,
        username: user.username,
        email: user.email,
      }
    };

    return sendSuccessResponse(response, responseData);
  } catch (error: any) {
    next(error);
  }
};

// Middlewares ________________________

export const validateLoginData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = request.body;
    userSchema.parse(data);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateSignupData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = request.body;
    userSignupSchema.parse(data);
    next();
  } catch (error) {
    next(error);
  }
};
