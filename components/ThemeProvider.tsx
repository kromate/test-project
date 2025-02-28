'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Effect runs on client side only
  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);
    
    // Listen for system preference changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme');
      // Only change if user hasn't explicitly set a preference
      if (!savedTheme) {
        const newDarkMode = e.matches;
        setDarkMode(newDarkMode);
        document.documentElement.classList.toggle('dark', newDarkMode);
        document.documentElement.classList.toggle('light', !newDarkMode);
      }
    };
    
    darkModeMediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => {
      const newDarkMode = !prevDarkMode;
      
      // Save to localStorage
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      
      // Toggle classes
      document.documentElement.classList.toggle('dark', newDarkMode);
      document.documentElement.classList.toggle('light', !newDarkMode);
      
      return newDarkMode;
    });
  };

  // Show a blank div until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
} 