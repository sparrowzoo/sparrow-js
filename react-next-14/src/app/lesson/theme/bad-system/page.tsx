'use client'
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export  default function App() {
    function MyComponent() {
        const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
        return <span>{`prefers-color-scheme: dark: ${prefersDarkMode}`}</span>;
    }

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <MyComponent/>
        </ThemeProvider>
    );
}
