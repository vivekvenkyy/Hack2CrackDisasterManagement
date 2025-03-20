import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { Database, Role, User, Admin, Volunteer, Agency } from '@/lib/types';

// Define the type for the request body based on role
type RegisterData = {
  role: Role;
} & (User | Admin | Volunteer | Agency);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, ...data } = body as RegisterData;
    const db: Database = await readData();

    // Hash the password
    if ('password' in data) {
      data.password = await hashPassword(data.password);
    }

    // Add unique ID
    data.id = Date.now().toString();

    // Add the new user to the appropriate role array
    switch (role) {
      case 'user':
        db.users.push(data as User);
        break;
      case 'admin':
        db.admins.push(data as Admin);
        break;
      case 'volunteer':
        db.volunteers.push(data as Volunteer);
        break;
      case 'agency':
        db.agencies.push(data as Agency);
        break;
      default:
        throw new Error('Invalid role');
    }

    // Write the updated database
    await writeData(db);

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}