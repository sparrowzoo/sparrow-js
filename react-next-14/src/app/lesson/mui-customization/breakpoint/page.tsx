'use client'
import * as React from 'react';
import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {red, green, blue} from '@mui/material/colors';

const Root = styled('div')(({theme}) => ({
    padding: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
        backgroundColor: red[500],
    },
    [theme.breakpoints.up('md')]: {
        backgroundColor: blue[500],
    },
    [theme.breakpoints.up('lg')]: {
        backgroundColor: green[500],
    },
}));

export default function MediaQuery() {
    return (
        <Root>
            <Typography>
                xs, extra-small: 0px </Typography>
            <Typography>sm, small: 600px</Typography>
            <Typography>md, medium: 900px</Typography>
            <Typography> lg, large: 1200px</Typography>
            <Typography>xl, extra-large: 1536px</Typography>
<h1>调整屏幕大小试一下</h1>
            <Typography>down(md): red</Typography>
            <Typography>up(md): blue</Typography>
            <Typography>up(lg): green</Typography>
        </Root>
    );
}