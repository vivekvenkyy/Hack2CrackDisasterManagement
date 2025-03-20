'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Inbox, FileText, Users, LogOut, Menu, X } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { Role } from '@/lib/types';

interface UserCookie {
  id: string;
  role: Role;
  name: string;
  [key: string]: any;
}

export default function Navbar() {
  const [user, setUser] = useState<UserCookie | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUser(null);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    setUser(null);
    router.push('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Navbar with Background Blur */}
      <nav className="bg-green-800/80 backdrop-blur-md text-white py-4 px-4 md:px-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-800 text-lg font-bold">M</span>
            </div>
            <span className="text-xl font-semibold">Disaster Management</span>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center gap-2 hover:text-yellow-500 transition">
              <Home size={20} /> Home
            </Link>
            <Link href="/inbox" className="flex items-center gap-2 hover:text-yellow-500 transition">
              <Inbox size={20} /> Inbox
            </Link>
            <Link href="/documents" className="flex items-center gap-2 hover:text-yellow-500 transition">
              <FileText size={20} /> Documents
            </Link>
            <Link href="/contacts" className="flex items-center gap-2 hover:text-yellow-500 transition">
              <Users size={20} /> Contacts
            </Link>

            {/* Profile & Logout (Desktop) */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">
                  {getInitials(user.name)}
                </div>
                <ProfileDropdown user={user} onLogout={handleLogout} />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white hover:text-red-500 transition"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-white hover:text-yellow-500 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu (Visible when toggled) */}
        {isOpen && (
          <div className="md:hidden bg-green-800/90 backdrop-blur-md mt-4 rounded-lg p-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-700"
              >
                <Home size={20} /> Home
              </Link>
              <Link
                href="/inbox"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-700"
              >
                <Inbox size={20} /> Inbox
              </Link>
              <Link
                href="/documents"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-700"
              >
                <FileText size={20} /> Documents
              </Link>
              <Link
                href="/contacts"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-700"
              >
                <Users size={20} /> Contacts
              </Link>

              {/* Profile & Logout (Mobile) */}
              {user ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">
                    {getInitials(user.name)}
                  </div>
                  <ProfileDropdown user={user} onLogout={handleLogout} />
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-3 p-2 bg-red-600 rounded-lg hover:bg-red-500"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}