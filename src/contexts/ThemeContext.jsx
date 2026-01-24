import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
    MINIMAL: 'minimal',
    VIBRANT: 'vibrant',
    LIGHT: 'light'
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('booklistTheme') || THEMES.MINIMAL;
    });

    useEffect(() => {
        localStorage.setItem('booklistTheme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === THEMES.MINIMAL) return THEMES.VIBRANT;
            if (prev === THEMES.VIBRANT) return THEMES.LIGHT;
            return THEMES.MINIMAL;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
