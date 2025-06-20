import { db } from '../utils/db.server';
import { Prisma } from '@prisma/client';

interface CashBuyerFilters {
    city?: string;
    state?: string;
    zipcode?: string;
}

// Get list of cash buyers
export const getCashBuyers = async (
    filters: CashBuyerFilters,
    page: number = 1,
    pageSize: number = 20
) => {
    const skip = (page - 1) * pageSize;

    const whereClause: Prisma.cashBuyersWhereInput = {};
    if (filters.city) whereClause.city = { contains: filters.city, mode: 'insensitive' as Prisma.QueryMode };
    if (filters.state) whereClause.state = { contains: filters.state, mode: 'insensitive' as Prisma.QueryMode };
    if (filters.zipcode) whereClause.zipcode = { contains: filters.zipcode, mode: 'insensitive' as Prisma.QueryMode };

    const [cashBuyers, total] = await Promise.all([
        db.cashBuyers.findMany({
            where: whereClause,
            skip,
            take: pageSize,
            orderBy: {
                name: 'asc'
            }
        }),
        db.cashBuyers.count({
            where: whereClause
        })
    ]);

    return {
        data: cashBuyers,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }
    };
};

// Search and get list of cash buyers
export const searchCashBuyers = async (
    search: string,
    filters: Record<string, any>,
    page: number = 1,
    pageSize: number = 20
) => {
    const skip = (page - 1) * pageSize;

    const whereClause: Prisma.cashBuyersWhereInput = {};

    // Add search condition
    if (search) {
        whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { address: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { city: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { state: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { zipcode: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
        ];
    }

    // Add filter conditions
    if (filters) {
        if (filters.city) {
            whereClause.city = { contains: filters.city, mode: 'insensitive' as Prisma.QueryMode };
        }
        if (filters.state) {
            whereClause.state = { contains: filters.state, mode: 'insensitive' as Prisma.QueryMode };
        }
        if (filters.zipcode) {
            whereClause.zipcode = { contains: filters.zipcode, mode: 'insensitive' as Prisma.QueryMode };
        }
        if (filters.name) {
            whereClause.name = { contains: filters.name, mode: 'insensitive' as Prisma.QueryMode };
        }
        if (filters.address) {
            whereClause.address = { contains: filters.address, mode: 'insensitive' as Prisma.QueryMode };
        }
    }

    const [cashBuyers, total] = await Promise.all([
        db.cashBuyers.findMany({
            where: whereClause,
            skip,
            take: pageSize,
            orderBy: {
                name: 'asc'
            }
        }),
        db.cashBuyers.count({
            where: whereClause
        })
    ]);

    return {
        data: cashBuyers,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }
    };
};

// Get single cash buyer details
export const getCashBuyer = async (id: string) => {
    return db.cashBuyers.findUnique({
        where: { id }
    });
};

// Save cash buyer to user favorites
export const saveCashBuyer = async (userId: string, buyerId: string) => {
    return db.user_saved_buyers.create({
        data: {
            user_id: userId,
            buyer_id: buyerId
        }
    });
};

// Remove cash buyer from user favorites
export const unsaveCashBuyer = async (userId: string, buyerId: string) => {
    return db.user_saved_buyers.delete({
        where: {
            user_id_buyer_id: {
                user_id: userId,
                buyer_id: buyerId
            }
        }
    });
};

// Get list of user's saved cash buyers
export const getSavedCashBuyers = async (
    userId: string,
    page: number = 1,
    pageSize: number = 20
) => {
    // If pageSize is 0, return all data without pagination
    if (pageSize === 0) {
        const savedBuyers = await db.user_saved_buyers.findMany({
            where: { user_id: userId },
            include: {
                cash_buyers: true
            },
            orderBy: {
                saved_at: 'desc'
            }
        });

        return {
            data: savedBuyers.map(item => ({
                ...item.cash_buyers,
                saved_at: item.saved_at
            })),
            pagination: {
                page: 1,
                pageSize: 0,
                total: savedBuyers.length,
                totalPages: 1
            }
        };
    }

    const skip = (page - 1) * pageSize;

    const [savedBuyers, total] = await Promise.all([
        db.user_saved_buyers.findMany({
            where: { user_id: userId },
            include: {
                cash_buyers: true
            },
            skip,
            take: pageSize,
            orderBy: {
                saved_at: 'desc'
            }
        }),
        db.user_saved_buyers.count({
            where: { user_id: userId }
        })
    ]);

    return {
        data: savedBuyers.map(item => ({
            ...item.cash_buyers,
            saved_at: item.saved_at
        })),
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }
    };
};

// Create cash buyer submission
export const createCashBuyerSubmission = async (submissionData: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
}) => {
    return db.cash_buyer_submissions.create({
        data: {
            name: submissionData.name,
            address: submissionData.address,
            phone: submissionData.phone,
            email: submissionData.email,
            status: 'under_review', // Default status
        }
    });
}; 