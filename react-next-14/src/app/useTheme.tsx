import { createTheme, ThemeOptions } from "@mui/material/styles";
import * as React from "react";
import { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#ce93d8",
    },
  },
};
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#ce93d8",
    },
  },
};
const lightTheme = createTheme(lightThemeOptions);
const darkTheme = createTheme(darkThemeOptions);

export function useTheme() {
  const [mode, setMode] = React.useState<"light" | "dark" | "OS">("light");
  const toggleMode = React.useMemo(
    () => ({
      toggleMode: (theme: "light" | "dark" | "OS") => {
        setMode(theme);
      },
    }),
    []
  );
  const matchDark = "(prefers-color-scheme: dark)";
  useEffect(() => {
    const matchers = window.matchMedia(matchDark);
    //https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener
    matchers.addEventListener("change", (match) => {
      console.log("chane mode" + new Date());
      if (mode == "OS") {
        toggleMode.toggleMode(match.matches ? "dark" : "light");
      }
    });
  }, []);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  // https://zenoo.github.io/mui-theme-creator/
  // https://mui.com/material-ui/getting-started/
  let currentTheme;
  if (mode == "OS") {
    currentTheme = prefersDarkMode ? darkTheme : lightTheme;
  } else {
    currentTheme = mode == "light" ? lightTheme : darkTheme;
  }
  return { currentTheme, toggleMode };
}
