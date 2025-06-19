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
        orderBy: [
            { distressed_score: 'desc' },
            { id: 'asc' }
        ],
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

// Save property to user favorites
export const saveProperty = async (userId: string, propertyId: string) => {
    return db.user_saved_properties.create({
        data: {
            user_id: userId,
            property_id: propertyId
        }
    });
};

// Remove property from user favorites
export const unsaveProperty = async (userId: string, propertyId: string) => {
    return db.user_saved_properties.delete({
        where: {
            user_id_property_id: {
                user_id: userId,
                property_id: propertyId
            }
        }
    });
};

// Get list of user's saved properties
export const getSavedProperties = async (
    userId: string,
    page: number = 1,
    pageSize: number = 20
) => {
    // If pageSize is 0, return all data without pagination
    if (pageSize === 0) {
        const savedProperties = await db.user_saved_properties.findMany({
            where: { user_id: userId },
            include: {
                properties_distressed_duval_test: true
            },
            orderBy: {
                saved_at: 'desc'
            }
        });

        return {
            data: savedProperties.map(item => ({
                ...item.properties_distressed_duval_test,
                saved_at: item.saved_at
            })),
            pagination: {
                page: 1,
                pageSize: 0,
                total: savedProperties.length,
                totalPages: 1
            }
        };
    }

    const skip = (page - 1) * pageSize;

    const [savedProperties, total] = await Promise.all([
        db.user_saved_properties.findMany({
            where: { user_id: userId },
            include: {
                properties_distressed_duval_test: true
            },
            skip,
            take: pageSize,
            orderBy: {
                saved_at: 'desc'
            }
        }),
        db.user_saved_properties.count({
            where: { user_id: userId }
        })
    ]);

    return {
        data: savedProperties.map(item => ({
            ...item.properties_distressed_duval_test,
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

// Find comparable properties based on bedrooms, bathrooms, zipcode,and square footage (90%-110% range)
export const findComparableProperties = async (
    propertyId: string,
    page: number = 1,
    pageSize: number = 20
): Promise<{ data: any[]; total: number; page: number; pageSize: number; originalProperty: any }> => {
    // First, get the original property
    const originalProperty = await db.propertiesDistressed.findUnique({
        where: { id: propertyId }
    });

    if (!originalProperty) {
        throw new Error('Property not found');
    }

    // Get original property values
    const originalBedrooms = originalProperty.bedrooms;
    const originalBathrooms = originalProperty.bathrooms;
    const originalSquareFootage = originalProperty.squareFootage || 0;
    const originalZipcode = originalProperty.zipCode;

    // Build where conditions dynamically based on available data
    const where: Prisma.PropertiesDistressedWhereInput = {
        id: { not: propertyId } // Exclude the original property
    };

    // Add bedrooms condition if available
    if (originalBedrooms) {
        where.bedrooms = originalBedrooms;
    }

    // Add bathrooms condition if available
    if (originalBathrooms) {
        where.bathrooms = originalBathrooms;
    }

    // Add zipcode condition if available
    if (originalZipcode) {
        where.zipCode = originalZipcode;
    }

    // Add square footage condition if available and valid
    if (originalSquareFootage > 0) {
        const minSquareFootage = originalSquareFootage * 0.9;
        const maxSquareFootage = originalSquareFootage * 1.1;
        where.squareFootage = {
            gte: minSquareFootage,
            lte: maxSquareFootage
        };
    }

    // Calculate total count
    const total = await db.propertiesDistressed.count({ where });

    // Get paginated comparable properties
    const data = await db.propertiesDistressed.findMany({
        where,
        orderBy: [
            { distressed_score: 'desc' },
            { id: 'asc' }
        ],
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    return {
        data,
        total,
        page,
        pageSize,
        originalProperty
    };
}; 