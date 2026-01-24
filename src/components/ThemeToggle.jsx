import React from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const getIcon = () => {
        if (theme === THEMES.MINIMAL) return 'fa-moon';
        if (theme === THEMES.VIBRANT) return 'fa-sun';
        return 'fa-circle-half-stroke';
    };

    const getLabel = () => {
        if (theme === THEMES.MINIMAL) return 'Minimal';
        if (theme === THEMES.VIBRANT) return 'Vibrant';
        return 'Light';
    };

    const getNextTheme = () => {
        if (theme === THEMES.MINIMAL) return 'Vibrant';
        if (theme === THEMES.VIBRANT) return 'Light';
        return 'Minimal';
    };

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${getNextTheme()} mode`}
        >
            <i className={`fas ${getIcon()}`}></i>
            <span>{getLabel()}</span>
        </button>
    );
}

