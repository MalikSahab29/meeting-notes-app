import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/meetings — fetch all meetings
export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        tasks: true,        // include tasks in each meeting
        createdBy: {        // include who created it
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',  // newest first
      },
    });

    return NextResponse.json(meetings, { status: 200 });
  } catch (error) {
    console.error('GET /api/meetings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}

// POST /api/meetings — create a new meeting
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, userId } = body;

    // Basic validation
    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description: description || '',
        userId: parseInt(userId),
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error('POST /api/meetings error:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}