'use client'
import * as React from 'react';
import {createTheme,ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';




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

    const [state, setState] = React.useState({
        gilad: true,
        jason: false,
        antoine: false,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    const { gilad, jason, antoine } = state;
    const error = [gilad, jason, antoine].filter((v) => v).length !== 2;
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Assign responsibility</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
                            }
                            label="Gilad Gray"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={jason} onChange={handleChange} name="jason" />
                            }
                            label="Jason Killian"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
                            }
                            label="Antoine Llorca"
                        />
                    </FormGroup>
                    <FormHelperText>Be careful</FormHelperText>
                </FormControl>
                <FormControl
                    required
                    error={error}
                    component="fieldset"
                    sx={{ m: 3 }}
                    variant="standard"
                >
                    <FormLabel component="legend">Pick two</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
                            }
                            label="Gilad Gray"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={jason} onChange={handleChange} name="jason" />
                            }
                            label="Jason Killian"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
                            }
                            label="Antoine Llorca"
                        />
                    </FormGroup>
                    <FormHelperText>You can display an error</FormHelperText>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex' }}>
                <Button variant="contained" sx={{ m: 1 }}>
                    Dashed
                </Button>
                <Button variant="text" color="primary" sx={{ m: 1 }}>
                    Secondary
                </Button>
                <Button variant="contained" size="large" sx={{ m: 1 }}>
                    Large
                </Button>
                <Button variant="outlined" color="success" size="large" sx={{ m: 1 }}>
                    Secondary large
                </Button>
            </Box>
        </ThemeProvider>
    );
}
