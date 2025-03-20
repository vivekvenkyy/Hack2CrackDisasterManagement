'use client';
import { FormEvent, useState } from 'react';
import { Role } from '@/lib/types';
import { toast } from 'react-hot-toast';

interface RoleFormProps {
  role: Role;
  onSubmit: {
    endpoint: string;
    successMessage: string;
    buttonText: string;
    onSuccess: (data: { email: string; password: string; role: Role }) => void;
  };
}

export default function RoleForm({ role, onSubmit }: RoleFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        toast.error('Please fill in all fields.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(onSubmit.endpoint, {
        method: 'POST',
        body: JSON.stringify({
          role,
          email,
          password,
        }),
        headers: { 'Content-Type': 'application/json' },
        redirect: 'manual', // Prevent fetch from automatically following redirects
      });

      if (response.status === 200 || response.status === 302) {
        // Treat 302 as a success since the backend is redirecting
        toast.success(onSubmit.successMessage);
        onSubmit.onSuccess({ email, password, role });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isLoading}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          disabled={isLoading}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-500 hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {isLoading ? 'Logging in...' : onSubmit.buttonText}
      </button>
    </form>
  );
}