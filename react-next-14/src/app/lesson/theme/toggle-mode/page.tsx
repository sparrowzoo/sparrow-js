"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@/app/useTheme";
import { Button } from "@mui/material";

function Child({ mode }: { mode: string }) {
  const colorMode = React.useContext(ModeContext);
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
        p: 3,
      }}
    >
      <Button
        value={mode}
        sx={{
          ml: 1,
          bgcolor: "background.default",
          color: "text.primary",
        }}
        onClick={() => {
          colorMode.toggleMode(mode);
        }}
        color="inherit"
      >
        {mode}
      </Button>
    </Box>
  );
}

const ModeContext = React.createContext({
  toggleMode: (theme: any) => {},
});
export default function Parent() {
  const { currentTheme, toggleMode } = useTheme();
  return (
    <ModeContext.Provider value={toggleMode}>
      <ThemeProvider theme={currentTheme}>
        <Child mode={"light"} />
        <Child mode={"dark"} />
        <Child mode={"os"} />
      </ThemeProvider>
    </ModeContext.Provider>
  );
}
