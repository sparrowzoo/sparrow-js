'use client'
import * as React from 'react';
import {createTheme,ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// https://mui.com/material-ui/react-use-media-query/
// https://github.com/mui/material-ui/pull/39463
function MyComponent() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return <span>{`prefers-color-scheme: dark: ${prefersDarkMode}`}</span>;
}


function SimpleMediaQuery() {
    const matches = useMediaQuery('(min-width:600px)');
    return <span>{`(min-width:600px) matches: ${matches}`}</span>;
}

export default function App() {
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
            <SimpleMediaQuery/>
            <MyComponent/>
        </ThemeProvider>
    );
}
