import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { cookies } from 'next/headers';
import { Database, Role, User, Admin, Volunteer, Agency } from '@/lib/types';

// Type for the authenticated user cookie
interface AuthUser {
  id: string;
  role: Role;
}

// Union type for all possible user types
type ProfileData = User | Admin | Volunteer | Agency;

// Type for database keys
type DatabaseKey = keyof Database;

export async function GET() {
  try {
    const userCookies = await cookies();
    const userCookie = userCookies.get('user');
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role } = JSON.parse(userCookie.value) as AuthUser;
    const db: Database = await readData();

    const roleKey: DatabaseKey = role === 'agency' ? 'agencies' : `${role}s`;
    const userArray = db[roleKey] as ProfileData[];
    const user = userArray.find(u => u.id === id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    let safeUser: Omit<User, 'password'> | Omit<Admin, 'password'> | Omit<Volunteer, 'password'> | Omit<Agency, 'password'>;
    if ('password' in user) {
      const { password, ...rest } = user;
      safeUser = rest;
    } else {
      safeUser = user; // For types that might not have password (though in this case all do)
    }
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userCookies = await cookies();
    const userCookie = userCookies.get('user');
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role } = JSON.parse(userCookie.value) as AuthUser;
    const updates = await request.json() as Partial<ProfileData>;

    const db: Database = await readData();
    const roleKey: DatabaseKey = role === 'agency' ? 'agencies' : `${role}s`;
    const userArray = db[roleKey] as ProfileData[];
    const userIndex = userArray.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent password updates through this endpoint
    if ('password' in updates) {
      delete updates.password;
    }

    userArray[userIndex] = { ...userArray[userIndex], ...updates };
    await writeData(db);

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}