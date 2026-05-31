import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const history = await prisma.watchHistory.findMany({
      where: { userId: user.id },
      orderBy: { watchedAt: 'desc' },
      include: {
        movie: true,
        series: true,
        episode: true,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Get watch history error:', error);
    return NextResponse.json(
      { error: 'Failed to get watch history' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { movieId, seriesId, episodeId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const history = await prisma.watchHistory.upsert({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId: movieId || '',
        },
      },
      update: { watchedAt: new Date() },
      create: {
        userId: user.id,
        movieId: movieId || null,
        seriesId: seriesId || null,
        episodeId: episodeId || null,
      },
    });

    return NextResponse.json(history, { status: 201 });
  } catch (error) {
    console.error('Add watch history error:', error);
    return NextResponse.json(
      { error: 'Failed to add watch history' },
      { status: 500 }
    );
  }
}
