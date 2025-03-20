import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@/lib/types';

export default async function UserDashboard() {
  const userCookies = await cookies();
  const userCookie = userCookies.get('user');
  if (!userCookie || JSON.parse(userCookie.value).role !== 'user' as Role) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl">Welcome to User Dashboard</h1>
    </div>
  );
}