import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const [movies, series, animations, cartoons] = await Promise.all([
      prisma.movie.findMany({
        where: {
          status: 'PUBLISHED',
          title: { contains: q, mode: 'insensitive' },
        },
        take: 5,
      }),
      prisma.series.findMany({
        where: {
          status: 'PUBLISHED',
          title: { contains: q, mode: 'insensitive' },
        },
        take: 5,
      }),
      prisma.animation.findMany({
        where: {
          status: 'PUBLISHED',
          title: { contains: q, mode: 'insensitive' },
        },
        take: 5,
      }),
      prisma.cartoon.findMany({
        where: {
          status: 'PUBLISHED',
          title: { contains: q, mode: 'insensitive' },
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      results: [
        ...movies.map(m => ({ ...m, type: 'movie' })),
        ...series.map(s => ({ ...s, type: 'series' })),
        ...animations.map(a => ({ ...a, type: 'animation' })),
        ...cartoons.map(c => ({ ...c, type: 'cartoon' })),
      ],
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
