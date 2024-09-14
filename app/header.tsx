import React from 'react';
import {Stack, IconButton, Typography, Tooltip, Modal, Box} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';

interface HeaderProps {
    title: string
    info: string
    sx?: any
}

export default function Header(props: HeaderProps) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="header">
            <div className="header-content">
                <Stack direction='row'>
                    <Tooltip title="Home">
                        <IconButton
                            href={".."}
                            color='secondary'
                            sx={{position: 'absolute', left: 0}}
                        >
                            <HomeIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography variant='h1' sx={{margin: 'auto'}}>
                        {props.title}
                    </Typography>
                    <Tooltip title="More Info">
                        <IconButton
                            onClick={handleOpen}
                            color='secondary'
                            sx={{position: 'absolute', right: 0}}
                        >
                            <HelpIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    background: 'white',
                    boxShadow: 24,
                    p: 4
                }}>
                    <Typography>
                        {props.info}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}