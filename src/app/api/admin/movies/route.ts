import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import { prisma } from '@/lib/prisma';
import { MovieSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validation = MovieSchema.parse(body);

    const movie = await prisma.movie.create({
      data: {
        ...validation,
        slug: generateSlug(validation.title),
      },
    });

    await prisma.adminLog.create({
      data: {
        userId: session.user.id as string,
        action: 'CREATE_MOVIE',
        target: 'Movie',
        targetId: movie.id,
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Create movie error:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}
