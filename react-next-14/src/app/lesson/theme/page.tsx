"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@/app/useTheme";
import { Button } from "@mui/material";

function Child({ mode }: { mode: string }) {
  console.log("Children Execute ....." + mode + Math.random());
  const colorMode = React.useContext(ToggleModeContext);
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

function ChildClear() {
  //由useMediaQuery 决定的
  console.log(
    "理论上只会执行一次，但在这里，即使把ToggleModeContext 和ThemeProvider全部移除，依然会执行"
  );
  return <div>干净的组件我不会变</div>;
}

const ToggleModeContext = React.createContext({
  toggleMode: (theme: any) => {},
});

function InnerParent() {
  console.log("innerParent");
  const { currentTheme, toggleMode } = useTheme();
  return (
    <>
      <ToggleModeContext.Provider value={toggleMode}>
        <ChildClear />
        <ThemeProvider theme={currentTheme}>
          <Child mode={"light"} />
          <Child mode={"dark"} />
          <Child mode={"OS"} />
        </ThemeProvider>
      </ToggleModeContext.Provider>
    </>
  );
}

export default function Parent() {
  return (
    <>
      <ChildClear />
      <InnerParent />
    </>
  );
}
