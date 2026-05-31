import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [series, total] = await Promise.all([
      prisma.series.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: true, genres: true, actors: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.series.count({ where: { status: 'PUBLISHED' } }),
    ]);

    return NextResponse.json({
      series,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get series error:', error);
    return NextResponse.json(
      { error: 'Failed to get series' },
      { status: 500 }
    );
  }
}
