'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SessionProfile = () => {
  const { data: session, status } = useSession(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (status === 'loading') {
    return <div className="bg-gray-200 dark:bg-gray-700 w-20 h-6 rounded-md animate-pulse"></div>;
  }

  if (!session) {
    return (
      <Link href="/login" className="btn text-sm px-4 py-2">
        Login
      </Link>
    );
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const getShortName = (fullName) => {
    if (!fullName) return 'User';
    const words = fullName.split(' ');
    if (words.length > 1 && words[0] && words[1]) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const shortName = getShortName(session.user.fullName);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 w-10 h-10 rounded-full font-bold text-gray-800 dark:text-gray-200 ring-2 ring-transparent hover:ring-blue-500 transition-all"
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        {shortName}
      </button>

      {menuOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50
                     bg-white ring-1 ring-black ring-opacity-5
                     dark:bg-gray-800 dark:ring-1 dark:ring-gray-700
                     origin-top-right transition-all duration-200 ease-out
                     transform opacity-100 scale-100"
        >
          <div className="py-1">
            {!session.user.isAdmin && (
              <Link
                href="/my-estimates"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                My Estimates
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-700"
            >
              {/* Logout Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 006.75 21h6.75a2.25 2.25 0 002.25-2.25V15M9 12h12m0 0l-3-3m3 3l-3 3" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionProfile;