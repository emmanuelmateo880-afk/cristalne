import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId');
    const skip = (page - 1) * limit;

    const where: any = { status: 'PUBLISHED' };
    if (categoryId) where.categoryId = categoryId;

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: { category: true, genres: true, actors: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.movie.count({ where }),
    ]);

    return NextResponse.json({
      movies,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get movies error:', error);
    return NextResponse.json(
      { error: 'Failed to get movies' },
      { status: 500 }
    );
  }
}
