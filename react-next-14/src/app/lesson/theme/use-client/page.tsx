import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// https://mui.com/material-ui/react-use-media-query/
function MyComponent() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    return <span>{`theme.breakpoints.up('sm') matches: ${matches}`}</span>;
}


export default function Page(){
    return <MyComponent/>
}