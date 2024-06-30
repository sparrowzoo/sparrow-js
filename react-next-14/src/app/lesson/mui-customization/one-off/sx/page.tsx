import * as React from 'react';
import Slider from '@mui/material/Slider';
import {Button} from "@mui/material";
import './button.css';
export default function SxProp() {
    return (<>
            <Slider
                defaultValue={30}
                sx={{
                    width: 300,
                    color: 'error.main',
                }}
            />
            These class names can't be used as CSS selectors because they are unstable
            <Slider
                defaultValue={30}
                sx={{
                    width: 300,
                    color: 'success.main',
                    '& .MuiSlider-thumb': {
                        borderRadius: '1px',
                    },
                }}
            />
            <Button className="Button">正常的按钮</Button>
            <Button disabled className="Button"> Disabled Button</Button>
        </>
    );
}
