import React from "react";
import GlobalStyles from "@mui/material/GlobalStyles";

export const gray = {
  50: "hsl(220, 60%, 99%)",
  100: "hsl(220, 35%, 94%)",
  200: "hsl(220, 35%, 88%)",
  300: "hsl(220, 25%, 80%)",
  400: "hsl(220, 20%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 25%, 35%)",
  700: "hsl(220, 25%, 25%)",
  800: "hsl(220, 25%, 10%)",
  900: "hsl(220, 30%, 5%)",
};
// To add global baseline styles for some of the HTML elements,
// use the GlobalStyles component.
// Here is an example of how you can override styles for the h1 elements:

/**
 * 注意，只能为html标签重写样式
 */
const SZGlobalStyles = (
  <GlobalStyles
    styles={{
      h1: { color: "red" },
      input: {
        color: "red !important",
      },
    }}
  />
);
export default SZGlobalStyles;
