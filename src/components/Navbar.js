'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LightDarkMode from './LightDarkMode';
import SessionProfile from './SessionProfile';

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClasses = "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      {isAdmin ? (
        <>
          <Link href="/adminPage" className={linkClasses} onClick={handleLinkClick}>Fuel Prices</Link>
          <Link href="/admin/blogs" className={linkClasses} onClick={handleLinkClick}>Manage Blogs</Link>
        </>
      ) : (
        <>
          <Link href="/" className={linkClasses} onClick={handleLinkClick}>Home</Link>
          <Link href="/blog" className={linkClasses} onClick={handleLinkClick}>Blog</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold" onClick={handleLinkClick}>
          Travel Helper
        </Link>

        {/* Desktop Menu & Right-side Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
          <SessionProfile />
          <LightDarkMode />
        </div>

        <div className="md:hidden flex items-center">
            <SessionProfile /> 
            <LightDarkMode />
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 ml-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle mobile menu"
            >
                {/* Hamburger Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 18h-8"></path>
                </svg>
            </button>
        </div>
      </div>
      <div className={`md:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;