import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@/lib/types';

export default async function VolunteerDashboard() {
  const userCookies = await cookies();
  const userCookie = userCookies.get('user');
  if (!userCookie || JSON.parse(userCookie.value).role !== 'volunteer' as Role) {
    redirect('/login');
  }

  const userData = JSON.parse(userCookie.value);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl mb-4">Welcome to Volunteer Dashboard</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl mb-2">Volunteer Information</h2>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Locality:</strong> {userData.locality}</p>
        <p><strong>Transport:</strong> {userData.transport}</p>
        <div className="mt-4">
          <h3 className="text-lg">Volunteer Actions</h3>
          <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            View Available Tasks
          </button>
        </div>
      </div>
    </div>
  );
}