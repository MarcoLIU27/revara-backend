import { db } from '../utils/db.server';
import { Prisma } from '@prisma/client';

export const searchProperties = async (
    search: string,
    filters: Record<string, any>,
    page: number = 1,
    pageSize: number = 20
): Promise<{ data: any[]; total: number; page: number; pageSize: number }> => {
    const where: Prisma.PropertiesDistressedWhereInput = {};

    // Add search condition
    if (search) {
        where.searchaddress = {
            contains: search,
            mode: 'insensitive'
        };
    }

    // Add other filter conditions
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                where[key as keyof typeof where] = value;
            }
        });
    }

    // Calculate total count
    const total = await db.propertiesDistressed.count({ where });

    // Get paginated data
    const data = await db.propertiesDistressed.findMany({
        where,
        orderBy: {
            distressed_score: 'desc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    return {
        data,
        total,
        page,
        pageSize
    };
};

export const getProperty = async (id: string): Promise<any | null> => {
    const property = await db.propertiesDistressed.findUnique({
        where: { id }
    });

    if (!property) {
        throw new Error('Property not found');
    }

    return property;
};

export const deleteProperty = async (id: string) => {
    const property = await db.propertiesDistressed.findUnique({
        where: { id }
    });

    if (!property) {
        throw new Error('Property not found');
    }

    await db.propertiesDistressed.delete({
        where: { id }
    });

    return true;
}; 