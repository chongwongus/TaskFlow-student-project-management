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
    primaryColor: "#5c6bc0",
    primaryDark: "#3949ab",
    primaryLight: "#8e99f3",
    backgroundColor: "#2e3440", // lighter dark grey
    lightBackgroundColor: "#3b4252", // lighter than backgroundColor
    fontColor: "#eceff4",
    secondaryColor: "#434c5e",
    ternaryColor: "#4c566a",
    successColor: "#43a047",
    warningColor: "#ffa000",
    dangerColor: "#e53935",
    infoColor: "#1e88e5"
}

