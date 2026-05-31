import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    const movie = await prisma.movie.update({
      where: { id: params.id },
      data: body,
    });

    await prisma.adminLog.create({
      data: {
        userId: session.user.id as string,
        action: 'UPDATE_MOVIE',
        target: 'Movie',
        targetId: movie.id,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Update movie error:', error);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const movie = await prisma.movie.delete({
      where: { id: params.id },
    });

    await prisma.adminLog.create({
      data: {
        userId: session.user.id as string,
        action: 'DELETE_MOVIE',
        target: 'Movie',
        targetId: movie.id,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Delete movie error:', error);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}
