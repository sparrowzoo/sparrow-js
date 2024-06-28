import React from "react";

// 定义一个Context对象，用于跨组件通信
const ThemeContext = React.createContext("");

// ThemeProvider组件
export default function ThemeProvider({
  children,
  theme,
}: {
  children: any;
  theme: any;
}) {
  console.log("theme provider");
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
