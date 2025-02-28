'use client';
import { MoonIcon, SunIcon } from './Icons';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-blue shadow-md py-6 px-4 md:px-16">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold text-lg md:text-2xl dark:text-white text-very-dark-blue-lm">
          Where in the world?
        </h1>
        <button 
          onClick={toggleDarkMode}
          className="flex items-center gap-2 dark:text-white text-very-dark-blue-lm font-semibold"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <>
              <SunIcon className="w-5 h-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <MoonIcon className="w-5 h-5" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
} 