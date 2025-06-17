import { TuserUpdateSchema, userUpdateSchema } from '../types/zod';
import { NextFunction, Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { sendBadRequestResponse, sendSuccessResponse, sendUnauthorizedResponse } from '../utils/responseHandler';

export const getUserProfile = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = {
      id: request.user?.id,
      fullName: request.user?.full_name,
      username: request.user?.username,
      email: request.user?.email,
      role: request.user?.role,
      status: request.user?.status,
      email_verified: request.user?.email_verified,
      profile_image: request.user?.profile_image,
      credits: request.user?.credits,
    };
    return sendSuccessResponse(response, user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (request: Request, response: Response, next: NextFunction) => {
  try {
    let userId = '';
    if (request.user) {
      userId = request.user?.id;
    }
    if (!userId) {
      return sendUnauthorizedResponse(response, 'Unauthorized');
    }
    const data: TuserUpdateSchema = request.body;
    const updatedData: Partial<TuserUpdateSchema> = {};

    if (data.fullName) {
      updatedData.fullName = data.fullName;
    }

    if (Object.keys(updatedData).length === 0) {
      return sendBadRequestResponse(response, 'No valid fields to update');
    }
    console.log(updatedData);
    const user = await UserService.updateUserByID(userId, updatedData);
    return sendSuccessResponse(response, user);
  } catch (error) {
    next(error);
  }
};

export const validateUpdateUserProfile = (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = request.body;
    userUpdateSchema.parse(data);
    next();
  } catch (error) {
    next(error);
  }
};
