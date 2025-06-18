import { NextFunction, Request, Response } from 'express';
import * as PropertiesService from '../services/properties.service';
import { sendSuccessResponse, sendUnauthorizedResponse } from '../utils/responseHandler';

export const searchProperties = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { search, filters, page, pageSize } = request.query;
        let parsedFilters: Record<string, any> = {};
        if (typeof filters === 'string') {
            try {
                parsedFilters = JSON.parse(filters);
            } catch (e) {
                return response.status(400).json({ success: false, error: 'Invalid filters JSON' });
            }
        }

        const pageNum = page ? parseInt(page as string, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize as string, 10) : 20;

        const properties = await PropertiesService.searchProperties(
            search as string,
            parsedFilters,
            pageNum,
            pageSizeNum
        );
        return sendSuccessResponse(response, properties);
    } catch (error: any) {
        next(error);
    }
};

export const getProperty = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        const property = await PropertiesService.getProperty(id);
        return sendSuccessResponse(response, property);
    } catch (error: any) {
        next(error);
    }
};

export const deleteProperty = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        await PropertiesService.deleteProperty(id);
        return sendSuccessResponse(response, { message: 'Property deleted successfully' });
    } catch (error: any) {
        next(error);
    }
};

// Save property to user favorites
export const saveProperty = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        const user = request.user;

        if (!user) {
            return sendUnauthorizedResponse(response, 'User not found');
        }

        await PropertiesService.saveProperty(user.id, id);
        return sendSuccessResponse(response, { message: 'Property saved successfully' });
    } catch (error: any) {
        next(error);
    }
};

// Remove property from user favorites
export const unsaveProperty = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        const user = request.user;

        if (!user) {
            return sendUnauthorizedResponse(response, 'User not found');
        }

        await PropertiesService.unsaveProperty(user.id, id);
        return sendSuccessResponse(response, { message: 'Property removed from saved list' });
    } catch (error: any) {
        next(error);
    }
};

// Get list of user's saved properties
export const getSavedProperties = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = request.user;
        const { page, pageSize } = request.query;

        if (!user) {
            return sendUnauthorizedResponse(response, 'User not found');
        }

        const pageNum = page ? parseInt(page as string, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize as string, 10) : 20;

        const savedProperties = await PropertiesService.getSavedProperties(user.id, pageNum, pageSizeNum);
        return sendSuccessResponse(response, savedProperties);
    } catch (error: any) {
        next(error);
    }
};

// Find comparable properties
export const findComparableProperties = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        const { page, pageSize } = request.query;

        const pageNum = page ? parseInt(page as string, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize as string, 10) : 5;

        const comparableProperties = await PropertiesService.findComparableProperties(
            id,
            pageNum,
            pageSizeNum
        );

        return sendSuccessResponse(response, comparableProperties);
    } catch (error: any) {
        next(error);
    }
}; 