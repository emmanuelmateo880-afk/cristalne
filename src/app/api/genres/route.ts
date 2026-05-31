import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(genres);
  } catch (error) {
    console.error('Get genres error:', error);
    return NextResponse.json(
      { error: 'Failed to get genres' },
      { status: 500 }
    );
  }
}
