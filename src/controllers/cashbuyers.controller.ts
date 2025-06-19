import { NextFunction, Request, Response } from 'express';
import * as CashBuyersService from '../services/cashbuyers.service';
import { sendSuccessResponse, sendUnauthorizedResponse } from '../utils/responseHandler';

// Search and get list of cash buyers
export const searchCashBuyers = async (request: Request, response: Response, next: NextFunction) => {
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

        const cashBuyers = await CashBuyersService.searchCashBuyers(
            search as string,
            parsedFilters,
            pageNum,
            pageSizeNum
        );
        return sendSuccessResponse(response, cashBuyers);
    } catch (error: any) {
        next(error);
    }
};

// Get single cash buyer details
export const getCashBuyer = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        const cashBuyer = await CashBuyersService.getCashBuyer(id);

        if (!cashBuyer) {
            return sendUnauthorizedResponse(response, 'Cash buyer not found');
        }

        return sendSuccessResponse(response, cashBuyer);
    } catch (error: any) {
        next(error);
    }
};

// Save cash buyer to user favorites
export const saveCashBuyer = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        const user = request.user;

        if (!user) {
            return sendUnauthorizedResponse(response, 'User not found');
        }

        await CashBuyersService.saveCashBuyer(user.id, id);
        return sendSuccessResponse(response, { message: 'Cash buyer saved successfully' });
    } catch (error: any) {
        next(error);
    }
};

// Remove cash buyer from user favorites
export const unsaveCashBuyer = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        const user = request.user;

        if (!user) {
            return sendUnauthorizedResponse(response, 'User not found');
        }

        await CashBuyersService.unsaveCashBuyer(user.id, id);
        return sendSuccessResponse(response, { message: 'Cash buyer removed from saved list' });
    } catch (error: any) {
        next(error);
    }
};

// Get list of user's saved cash buyers
export const getSavedCashBuyers = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = request.user;
        const { page, pageSize } = request.query;

        if (!user) {
            return sendUnauthorizedResponse(response, 'User not found');
        }

        const pageNum = page ? parseInt(page as string, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize as string, 10) : 10;

        // If pageSize is 0, pass 0 to service to get all data
        const savedCashBuyers = await CashBuyersService.getSavedCashBuyers(user.id, pageNum, pageSizeNum);
        return sendSuccessResponse(response, savedCashBuyers);
    } catch (error: any) {
        next(error);
    }
}; 