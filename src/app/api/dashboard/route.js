import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/dashboard — fetch all stats in one call
export async function GET() {
  try {
    // Run all queries simultaneously (faster than one by one)
    const [
      totalMeetings,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      doneTasks,
      overdueTasks,
      recentTasks,
    ] = await Promise.all([
      // Count meetings
      prisma.meeting.count(),

      // Count all tasks
      prisma.task.count(),

      // Count pending tasks
      prisma.task.count({
        where: { status: 'pending' },
      }),

      // Count in progress tasks
      prisma.task.count({
        where: { status: 'in progress' },
      }),

      // Count done tasks
      prisma.task.count({
        where: { status: 'done' },
      }),

      // Count overdue tasks (deadline passed + not done)
      prisma.task.count({
        where: {
          status: { not: 'done' },
          deadline: { lt: new Date() },
        },
      }),

      // Get 5 most recent tasks with relations
      prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: {
            select: { id: true, name: true },
          },
          meeting: {
            select: { id: true, title: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalMeetings,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        doneTasks,
        overdueTasks,
      },
      recentTasks,
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}