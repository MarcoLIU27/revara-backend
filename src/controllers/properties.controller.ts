import { NextFunction, Request, Response } from 'express';
import * as PropertiesService from '../services/properties.service';
import { sendSuccessResponse } from '../utils/responseHandler';

export const searchProperties = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { search, filters, page, pageSize } = request.query;

        // 转换分页参数为数字，并提供默认值
        const pageNum = page ? parseInt(page as string, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize as string, 10) : 20;

        const properties = await PropertiesService.searchProperties(
            search as string,
            filters as Record<string, any>,
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