import { db } from '../utils/db.server';
import { Prisma } from '@prisma/client';

export const searchProperties = async (
    search: string,
    filters: Record<string, any>,
    page: number = 1,
    pageSize: number = 20
): Promise<{ data: any[]; total: number; page: number; pageSize: number }> => {
    const where: Prisma.PropertiesDistressedWhereInput = {};

    // 添加搜索条件
    if (search) {
        where.formattedAddress = {
            contains: search,
            mode: 'insensitive'
        };
    }

    // 添加其他过滤条件
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                where[key as keyof typeof where] = value;
            }
        });
    }

    // 计算总数
    const total = await db.propertiesDistressed.count({ where });

    // 获取分页数据
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
    return db.propertiesDistressed.findUnique({
        where: {
            id
        }
    });
}; 