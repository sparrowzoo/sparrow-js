'use client'
import React from "react";
import { Avatar, Box, Divider, IconButton, InputBase, ListItemIcon, Menu, MenuItem, Paper, Tooltip, Typography } from "@mui/material";
import { Image, Logout, PersonAdd, Settings } from "@mui/icons-material";

import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
export default function Page() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <header className="header">
            <div className="left">
                <img src={"../../logo.png"} alt={"weave dremes"} />
<span>WEAVE DREAMS</span>
            </div>
            <div className="right">
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Paper component="div"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, height: 44 }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Designer/Clothing"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>

                    <Typography sx={{ minWidth: 100 }}>HOME</Typography>
                    <Typography sx={{ minWidth: 100 }}>CALLERY</Typography>
                    <Typography sx={{ minWidth: 100 }}>SHOP</Typography>
                    <Typography sx={{ minWidth: 40 }}>AI</Typography>



                    <Tooltip sx={{height:60}} title="Account settings">
                        <IconButton onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-haspopup="true"
                        >
                            <Avatar src="/logo.png"  sx={{ width: 44, height: 44 }}>M</Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}>
                        <Avatar /> Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <FavoriteIcon fontSize="small" />
                        </ListItemIcon>
                        My Liked
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </header>
    );
}
