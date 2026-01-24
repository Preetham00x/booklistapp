import React from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isVibrant = theme === THEMES.VIBRANT;

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${isVibrant ? 'Minimal' : 'Vibrant'} mode`}
        >
            <i className={`fas ${isVibrant ? 'fa-moon' : 'fa-sun'}`}></i>
            <span>{isVibrant ? 'Minimal' : 'Vibrant'}</span>
        </button>
    );
}
