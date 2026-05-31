import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const [trending, topRated, latest] = await Promise.all([
      prisma.movie.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: limit,
      }),
      prisma.movie.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { rating: 'desc' },
        take: limit,
      }),
      prisma.movie.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    ]);

    return NextResponse.json({ trending, topRated, latest });
  } catch (error) {
    console.error('Get trending error:', error);
    return NextResponse.json(
      { error: 'Failed to get trending' },
      { status: 500 }
    );
  }
}
