import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/tasks — fetch all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        meeting: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks — create a new task
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, deadline, userId, meetingId } = body;

    // Basic validation
    if (!title || !userId || !meetingId) {
      return NextResponse.json(
        { error: 'Title, userId and meetingId are required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        deadline: deadline ? new Date(deadline) : null,
        status: 'pending',
        userId: parseInt(userId),
        meetingId: parseInt(meetingId),
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}