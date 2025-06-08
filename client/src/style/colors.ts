export interface Theme {
    infoColor: string | null;
    dangerColor: string | null;
    warningColor: string | null;
    successColor: string | null;
    primaryColor: string;
    primaryLight: string | null;
    primaryDark: string | null;
    backgroundColor: string;
    lightBackgroundColor: string;
    fontColor: string;
    secondaryColor: string;
    ternaryColor: string;
}

export const LightTheme: Theme = {
    primaryColor: "#4a6cfa",
    primaryDark: "#3d5bd9",
    primaryLight: "#e8efff",
    backgroundColor: "#ffffff",
    lightBackgroundColor: "#f0f4ff",
    fontColor: "#333333",
    secondaryColor: "#f5f7ff",
    ternaryColor: "#e0e0e0",
    successColor: "#4caf50",
    warningColor: "#ff9800",
    dangerColor: "#f44336",
    infoColor: "#2196f3"
}

export const DarkTheme: Theme = {
    primaryColor: "#6c7fff", // Brighter, more vibrant blue
    primaryDark: "#5a6cfa", // Slightly darker but still bright
    primaryLight: "#9ca8ff", // Light blue for accents
    backgroundColor: "#1a1a1a", // Much darker background for better contrast
    lightBackgroundColor: "#2a2a2a", // Lighter cards/sections
    fontColor: "#ffffff", // Pure white text for maximum readability
    secondaryColor: "#333333", // Medium gray for secondary backgrounds
    ternaryColor: "#4a4a4a", // Lighter gray for borders/dividers
    successColor: "#4ade80", // Brighter green
    warningColor: "#fbbf24", // Brighter yellow/orange
    dangerColor: "#f87171", // Brighter red
    infoColor: "#60a5fa" // Brighter blue for info
}