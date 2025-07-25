// src/components/Navbar.js
'use client';

import Link from 'next/link';
import LightDarkMode from './LightDarkMode';
import SessionProfile from './SessionProfile';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  // --- Reusable Link Classes for consistency ---
  const linkClasses = "hover:text-gray-700 dark:hover:text-gray-300";

  return (
    <nav className="flex justify-between items-center my-10">
      <Link href="/" className="text-2xl font-bold">
        Travel Helper
      </Link>
      <div className="flex items-center text-xl font-medium space-x-6">
        {isAdmin ? (
          <>
            {/* --- CHANGE HERE: Added dark mode hover class --- */}
            <Link href="/adminPage" className={linkClasses}>
              Fuel Prices
            </Link>
            <Link href="/admin/blogs" className={linkClasses}>
              Manage Blogs
            </Link>
          </>
        ) : (
          <>
            {/* --- CHANGE HERE: Added dark mode hover class --- */}
            <Link href="/" className={linkClasses}>
              Home
            </Link>
            <Link href="/blog" className={linkClasses}>
              Blog
            </Link>
          </>
        )}
        <SessionProfile />
        <LightDarkMode />
      </div>
    </nav>
  );
};

export default Navbar;