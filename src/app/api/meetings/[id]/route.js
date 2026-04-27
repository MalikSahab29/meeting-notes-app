import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/meetings/:id — fetch single meeting with tasks
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const meeting = await prisma.meeting.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        tasks: {
          include: {
            assignedTo: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    console.error('GET /api/meetings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    );
  }
}

// DELETE /api/meetings/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Delete tasks first (foreign key constraint)
    await prisma.task.deleteMany({
      where: { meetingId: parseInt(id) },
    });

    await prisma.meeting.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Meeting deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/meetings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete meeting' },
      { status: 500 }
    );
  }
}