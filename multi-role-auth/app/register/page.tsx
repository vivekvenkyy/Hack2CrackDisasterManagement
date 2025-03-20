'use client';
import { useState } from 'react';
import RoleForm from '@/components/RoleForm';
import { Role } from '@/lib/types';

export default function Register() {
  const [role, setRole] = useState<Role>('user');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600">
            Select your role and register to get started.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Select Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white text-gray-900"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="volunteer">Volunteer</option>
            <option value="agency">Agency</option>
          </select>
        </div>

        {/* Role Form */}
        <div className="mt-6">
          <RoleForm
            role={role}
            onSubmit={{
              endpoint: '/api/auth/register',
              successMessage: 'Registration successful',
              buttonText: 'Register',
              onSuccess: (data: { email: string; password: string; role: Role }) => {
                console.log('Registration data:', data);
              },
            }}
          />
        </div>

        {/* Link to Login */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:text-green-500 font-medium transition-colors">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}