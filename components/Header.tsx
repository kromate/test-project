'use client';
import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from './Icons';
import { useTheme } from './ThemeProvider';

export default function Header() {
  // Fallback state if ThemeProvider is not available
  const [localDarkMode, setLocalDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Try to get theme from provider, but don't fail if not available
  let darkMode = localDarkMode;
  let contextToggleDarkMode: (() => void) | undefined;
  
  try {
    const contextTheme = useTheme();
    darkMode = contextTheme.darkMode;
    contextToggleDarkMode = contextTheme.toggleDarkMode;
  } catch (e) {
    // ThemeProvider not available, will use local state
  }
  
  const toggleDarkMode = () => {
    if (contextToggleDarkMode) {
      // Use context if available
      contextToggleDarkMode();
    } else {
      // Fallback implementation
      setLocalDarkMode(prev => {
        const newDarkMode = !prev;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
          
          // Toggle classes
          document.documentElement.classList.toggle('dark', newDarkMode);
          document.documentElement.classList.toggle('light', !newDarkMode);
        }
        
        return newDarkMode;
      });
    }
  };
  
  // Initialize state on client-side only
  useEffect(() => {
    // Only run this code on the client
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setLocalDarkMode(isDarkMode);
      setMounted(true);
    }
  }, []);
  
  // The actual UI content, used in both the hydration-safe and normal renders
  const content = (
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="font-bold text-lg md:text-2xl text-very-dark-blue-lm dark:text-white">
        Where in the world?
      </h1>
      <button 
        onClick={toggleDarkMode}
        className="flex items-center gap-2 text-very-dark-blue-lm dark:text-white font-semibold"
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
  );

  // Prevent hydration mismatch by showing a placeholder until mounted
  if (!mounted) {
    return (
      <header className="bg-white dark:bg-dark-blue shadow-md py-6 px-4 md:px-16">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-lg md:text-2xl text-very-dark-blue-lm dark:text-white">
            Where in the world?
          </h1>
          <div className="w-24 h-8"></div> {/* Placeholder for button */}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-dark-blue shadow-md py-6 px-4 md:px-16">
      {content}
    </header>
  );
} 