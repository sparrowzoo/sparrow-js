import * as React from "react";
import { createTheme, ThemeOptions } from "@mui/material/styles";

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
let f: any = null;

export function useTheme() {
  const [mode, setMode] = React.useState<"light" | "dark" | "OS">("OS");
  const toggleMode = React.useMemo(
    () => ({
      toggleMode: (theme: "light" | "dark" | "OS") => {
        setMode(theme);
      },
    }),
    []
  );
  console.log("is same object " + Object.is(toggleMode, f));
  f = toggleMode;
  // const matchDark = "(prefers-color-scheme: dark)";
  // useEffect(() => {
  //   const matchers = window.matchMedia(matchDark);
  //原生实现方式
  //   //https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener
  //   matchers.addEventListener("change", (match) => {
  //     console.log("chane mode" + Math.random());
  //     if (mode == "OS") {
  //       toggleMode.toggleMode(match.matches ? "dark" : "light");
  //     }
  //   });
  // }, []);
  //hook 必须在函数体内
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
