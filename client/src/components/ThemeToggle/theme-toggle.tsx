import { useState, useEffect } from "react";
import Toggle from "../Toggle/toggle";
import { Theme } from "../../style/colors";
import { userPreferenceService } from "../../services/api";

interface Props {
    DarkTheme: Theme;
    LightTheme: Theme;
    userEmail?: string;
}

const LIGHT_THEME_LABEL = "Toggle Dark Theme"
const DARK_THEME_LABEL = "Toggle Light Theme"

export default function ThemeToggle({LightTheme, DarkTheme, userEmail}:Props){
      // Initialize from localStorage or system preference
      const [darkTheme, setDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          return savedTheme === 'dark';
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      });
      
      const [label, setLabel] = useState(darkTheme ? DARK_THEME_LABEL : LIGHT_THEME_LABEL);

      // Apply theme on mount and when darkTheme changes
      useEffect(() => {
        const theme = darkTheme ? DarkTheme : LightTheme;
        setTheme(theme);
        setLabel(darkTheme ? DARK_THEME_LABEL : LIGHT_THEME_LABEL);
      }, [darkTheme, DarkTheme, LightTheme]);

      const ontoggle: any = async () => {
        const newTheme = !darkTheme;
        setDarkTheme(newTheme);
        
        // Save to localStorage immediately
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        
        // Apply theme immediately
        setTheme(newTheme ? DarkTheme : LightTheme);
        
        // Save to server if user is logged in
        if (userEmail) {
          try {
            await userPreferenceService.createUserPreference({
              email: userEmail,
              theme: newTheme ? 'dark' : 'light'
            });
          } catch (error) {
            console.log('Could not save user preference to server:', error);
          }
        }
      }

    return (
      <Toggle label={label} onClick={ontoggle}></Toggle>
    )
}

export function setTheme(theme: Theme): void{
  const root = document.documentElement;
  
  // Map theme properties to CSS variables that your SCSS actually uses
  root?.style.setProperty("--primary-color", theme.primaryColor);
  root?.style.setProperty("--primary-dark", theme.primaryDark || theme.primaryColor);
  root?.style.setProperty("--primary-light", theme.primaryLight || theme.primaryColor);
  
  // This is the key fix - map fontColor to text-color
  root?.style.setProperty("--text-color", theme.fontColor);
  root?.style.setProperty("--font-color", theme.fontColor);
  
  root?.style.setProperty("--background-color", theme.backgroundColor);
  root?.style.setProperty("--light-background", theme.lightBackgroundColor);
  
  // Fix light text readability for both themes
  if (theme.backgroundColor === "#1a1a1a") { // Dark theme
    root?.style.setProperty("--light-text", "#b0b0b0"); // Much more readable gray for dark mode
    root?.style.setProperty("--border-color", "#444444"); // Lighter border for dark mode
  } else { // Light theme
    root?.style.setProperty("--light-text", "#666666"); // Original dark gray for light mode
    root?.style.setProperty("--border-color", "#e0e0e0"); // Original light border
  }
  
  root?.style.setProperty("--success-color", theme.successColor || "#4caf50");
  root?.style.setProperty("--warning-color", theme.warningColor || "#ff9800");
  root?.style.setProperty("--danger-color", theme.dangerColor || "#f44336");
  root?.style.setProperty("--info-color", theme.infoColor || "#2196f3");
}