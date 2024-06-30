import * as React from 'react';
import {StyledEngineProvider} from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import {Button} from "@mui/material";
import './tailwind.css'
function Sliders() {
    return (
        <div>
            <Button className="button">按钮</Button>
            <Slider defaultValue={30}/>
            <Slider defaultValue={30} className="text-teal-1000,text-xs"/>
            <Slider
                defaultValue={30}
                className="text-teal-600"
                slotProps={{thumb: {className: 'rounded-sm'}}}
            />
            <Slider defaultValue={30} classes={{ active: 'shadow-none' }} />
        </div>
    );
}

export default function GlobalCssPriority() {
    return (
        <StyledEngineProvider injectFirst>
            <Sliders/>
        </StyledEngineProvider>
    );
}
