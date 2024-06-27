import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

// https://mui.com/material-ui/react-use-media-query/
function MyComponent() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return <span>{`prefers-color-scheme: dark: ${prefersDarkMode}`}</span>;
}


function SimpleMediaQuery() {
    const matches = useMediaQuery('(min-width:600px)');
    return <span>{`(min-width:600px) matches: ${matches}`}</span>;
}

export default function App() {
    return (
        <>
            <SimpleMediaQuery/>
            <div>给我加上use client，要不然我不会显示了！！！！</div>
            <MyComponent/>
        </>
    );
}
