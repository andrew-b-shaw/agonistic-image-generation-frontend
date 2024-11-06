import React from 'react';
import {Stack, IconButton, Typography, Tooltip, Modal, Box} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';

interface HeaderProps {
    title: string
    info: string
    authenticationKey: string | null
    sx?: any
}

export default function Header(props: HeaderProps) {
    const key: string = props.authenticationKey != null ? "?key=" + props.authenticationKey : "";

    return (
        <div className="header">
            <div className="header-content">
                <Stack direction='row'>
                    <Tooltip title="Home">
                        <IconButton
                            href={process.env.NEXT_PUBLIC_FRONTEND_PATH + key}
                            color='secondary'
                            sx={{position: 'absolute', left: 0}}
                        >
                            <HomeIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography variant='h1' sx={{margin: 'auto', color: 'white'}}>
                        {props.title}
                    </Typography>
                    <Tooltip title="More Info">
                        <IconButton
                            onClick={() => window.open(props.info)}
                            color='secondary'
                            sx={{position: 'absolute', right: 0}}
                        >
                            <HelpIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </div>
        </div>
    );
}