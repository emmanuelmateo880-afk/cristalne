import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const series = await prisma.series.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        genres: true,
        actors: true,
        seasons: {
          include: {
            episodes: {
              orderBy: { episodeNo: 'asc' },
            },
          },
          orderBy: { seasonNo: 'asc' },
        },
        comments: {
          where: { isApproved: true },
          include: { user: true },
          take: 10,
        },
      },
    });

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    await prisma.series.update({
      where: { id: series.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(series);
  } catch (error) {
    console.error('Get series error:', error);
    return NextResponse.json(
      { error: 'Failed to get series' },
      { status: 500 }
    );
  }
}
