import { useEffect, useState } from "react";
import Toggle from "../Toggle/toggle";
import { Theme } from "../../style/colors";

interface Props {
    DarkTheme: Theme;
    LightTheme: Theme;
}

const LIGHT_THEME_LABEL = "Toggle Dark Theme"
const DARK_THEME_LABEL = "Toggle Light Theme"

export default function PndThemeToggle({LightTheme, DarkTheme}:Props){
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      const [darkTheme, setDarkTheme] = useState(darkThemeMq.matches);
      const [label, setLabel] = useState(DARK_THEME_LABEL)

      const ontoggle: any =  () => {
        if(darkTheme){
          setDarkTheme(false)
          setLabel(LIGHT_THEME_LABEL)
        }
        else{
          setDarkTheme(true)
          setLabel(DARK_THEME_LABEL)
        }
      }
      
      function setTheme(theme: Theme): void{
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
          useEffect(() => {
            let theme = darkTheme ? DarkTheme : LightTheme;
            setTheme(theme);
          }, [darkTheme]);
    return (
      // <Toggle label={label} onClick={ontoggle}></Toggle>
      <></>
    )
}