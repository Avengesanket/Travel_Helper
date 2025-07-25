"use client";
import React from 'react';
import { useTheme } from './ThemeProvider'; 

const LightDarkMode = () => {
  const { theme, toggleTheme } = useTheme();

  if (!theme) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme} 
      className="ml-3 font-medium rounded-full focus:outline-none p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      <span className="group inline-flex shrink-0 justify-center items-center size-9">
        {theme === 'light' ? (
          <svg
            className="shrink-0 size-5 text-gray-800 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
        ) : (
          <svg
            className="shrink-0 size-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path><path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path><path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        )}
      </span>
    </button>
  );
};

export default LightDarkMode;