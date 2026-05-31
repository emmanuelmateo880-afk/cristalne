import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        genres: true,
        actors: true,
        comments: {
          where: { isApproved: true },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        ratings: true,
      },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    await prisma.movie.update({
      where: { id: movie.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    return NextResponse.json(
      { error: 'Failed to get movie' },
      { status: 500 }
    );
  }
}
