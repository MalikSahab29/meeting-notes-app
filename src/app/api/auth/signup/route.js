import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create JWT token
    const token = createToken(user);

    // Send response with token in cookie
    const response = NextResponse.json(
      {
        message: 'Account created successfully',
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,     // JS cannot access this cookie
      secure: false,      // set true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,  // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}