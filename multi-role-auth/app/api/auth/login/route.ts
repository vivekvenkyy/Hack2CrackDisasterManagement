import { NextResponse } from 'next/server';
import { readData } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Database, Role, User, Admin, Volunteer, Agency } from '@/lib/types';

interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}

type UserType = User | Admin | Volunteer | Agency;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Login request body:', body);

    const { email, password, role } = body as LoginRequest;
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db: Database = await readData();
    console.log('Database contents:', db);

    const roleKey = role === 'agency' ? 'agencies' : `${role}s` as keyof Database;
    const users = db[roleKey];
    console.log(`Users for role ${role}:`, users);

    const user = users.find((u: UserType) => 
      ('email' in u && u.email === email) || 
      ('phoneNumber' in u && u.phoneNumber === email)
    ) as UserType | undefined;
    console.log('Found user:', user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    if (!('password' in user)) {
      console.error('User object missing password field:', user);
      return NextResponse.json({ error: 'Invalid user data' }, { status: 500 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    (await cookies()).set('user', JSON.stringify({ id: user.id, role }), {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60
    });

    // Redirect to role-specific dashboard
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url), {
      status: 302
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}