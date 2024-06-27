"use client";
import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme,lightTheme } from "@/app/theme";
import { Checkbox } from "@mui/material";

export default function CustomStyles() {
  return (
      <ThemeProvider theme={darkTheme}>
          <Checkbox defaultChecked />
          <ThemeProvider theme={lightTheme}>
              <Checkbox defaultChecked />
          </ThemeProvider>
      </ThemeProvider>
  );
}
