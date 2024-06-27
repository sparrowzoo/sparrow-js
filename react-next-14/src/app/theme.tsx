import { createTheme, ThemeOptions } from "@mui/material/styles";
import * as React from "react";
// https://zenoo.github.io/mui-theme-creator/
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f6f3f7",
    },
    text: {
      secondary: "rgba(255,253,253,0.7)",
      disabled: "rgba(228,86,86,0.5)",
      // @ts-ignore
      hint: "#0e0c0c",
    },
    error: {
      main: "#ffffff",
      dark: "#ec0a0a",
    },
  },
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f6f3f7",
    },
    text: {
      secondary: "rgba(255,253,253,0.7)",
      disabled: "rgba(228,86,86,0.5)",
      // @ts-ignore
      hint: "#0e0c0c",
    },
    error: {
      main: "#ffffff",
      dark: "#ec0a0a",
    },
  },
};

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);
