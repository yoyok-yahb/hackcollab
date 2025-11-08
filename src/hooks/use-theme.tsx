'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
     if (typeof window === 'undefined') {
      return 'system';
    }
    try {
      return (localStorage.getItem('theme') as Theme) || 'system'
    } catch (e) {
      console.warn('Could not read theme from localStorage', e);
      return 'system'
    }
  });

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    let systemTheme: Theme = 'light';
     if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        systemTheme = 'dark'
    }

    if (theme === 'system') {
        root.classList.add(systemTheme)
    } else {
        root.classList.add(theme)
    }

  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem('theme', newTheme)
      } catch (e) {
         console.warn('Could not save theme to localStorage', e);
      }
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
