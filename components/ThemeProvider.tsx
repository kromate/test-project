'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeContextType = {
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
  // Use null for initial state to represent "not initialized yet"
  // This prevents hydration mismatches by not rendering a specific state during SSR
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Effect runs on client side only
  useEffect(() => {
    // Now we're on the client, we can check for dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);
    setMounted(true);
    
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
      // If darkMode is null (not initialized yet), default to false
      const currentDarkMode = prevDarkMode === null ? false : prevDarkMode;
      const newDarkMode = !currentDarkMode;
      
      // Save to localStorage
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      
      // Toggle classes
      document.documentElement.classList.toggle('dark', newDarkMode);
      document.documentElement.classList.toggle('light', !newDarkMode);
      
      return newDarkMode;
    });
  };

  // Show the children but without theme context until mounted
  // This approach is better than hiding because it allows SSR to work
  if (!mounted) {
    return (
      <ThemeContext.Provider 
        value={{ 
          darkMode: false, // Default value, won't be used before hydration
          toggleDarkMode: () => {} // Empty function, won't be called before hydration
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        darkMode: darkMode === null ? false : darkMode, 
        toggleDarkMode 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
} 