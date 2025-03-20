import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@/lib/types';

export default async function AgencyDashboard() {
    const userCookies = await cookies();
    const userCookie = userCookies.get('user');
   
  if (!userCookie || JSON.parse(userCookie.value).role !== 'agency' as Role) {
    redirect('/login');
  }

  const userData = JSON.parse(userCookie.value);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl mb-4">Welcome to Agency Dashboard</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl mb-2">Agency Details</h2>
        <p><strong>Agency Name:</strong> {userData.agencyName}</p>
        <p><strong>Agency ID:</strong> {userData.agencyId}</p>
        <p><strong>Contact:</strong> {userData.agencyContact}</p>
        <p><strong>Location:</strong> {userData.agencyLocation}</p>
        <p><strong>Proof:</strong> {userData.agencyProof}</p>
        <div className="mt-4">
          <h3 className="text-lg">Agency Operations</h3>
          <button className="mt-2 bg-purple-500 text-white px-4 py-2 rounded">
            Manage Projects
          </button>
        </div>
      </div>
    </div>
  );
}