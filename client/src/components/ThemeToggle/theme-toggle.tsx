import { useState } from "react";
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
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      const [darkTheme, setDarkTheme] = useState(darkThemeMq.matches);
      const [label, setLabel] = useState(DARK_THEME_LABEL)


      const ontoggle: any =  async () => {
        if(darkTheme){
          setDarkTheme(false)
          setLabel(LIGHT_THEME_LABEL)
          setTheme(LightTheme)
        }
        else{
          setDarkTheme(true)
          setLabel(DARK_THEME_LABEL)
          setTheme(DarkTheme)
      }
      const userPreferenceResponse = await userPreferenceService.createUserPreference({
        email: userEmail,
        theme: darkTheme ? 'dark' : 'light'
      })
    }

    return (
      <Toggle label={label} onClick={ontoggle}></Toggle>
      // <></>
    )
}

export function setTheme(theme: Theme): void{
  const root = document.documentElement;
  root?.style.setProperty(
    "--primary-color",
    theme.primaryColor
  );
  root?.style.setProperty(
    "--primary-dark",
    theme.primaryDark
  );
  root?.style.setProperty(
    "--primary-light",
    theme.primaryLight
  );
  root?.style.setProperty(
    "--font-color",
    theme.fontColor
  );
  root?.style.setProperty(
    "--background-color",
    theme.backgroundColor
  );
  root?.style.setProperty(
    "--light-background",
    theme.lightBackgroundColor
  );
  root?.style.setProperty(
    "--success-color",
    theme.successColor
  );
  root?.style.setProperty(
    "--warning-color",
    theme.warningColor
  );
  root?.style.setProperty(
    "--danger-color",
    theme.dangerColor
  );
  root?.style.setProperty(
    "--info-color",
    theme.infoColor
  );
}