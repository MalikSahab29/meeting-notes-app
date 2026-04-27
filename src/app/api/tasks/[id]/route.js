import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/tasks/:id — update a task (status, title, etc.)
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, description, deadline, status, userId } = body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(status && { status }),
        ...(userId && { userId: parseInt(userId) }),
      },
    });

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('PUT /api/tasks/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id — delete a task
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}