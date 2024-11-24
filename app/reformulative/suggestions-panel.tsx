'use client'

import React, {useState} from "react";
import {Button, Stack, Divider, ButtonBase, Typography, Collapse, Tooltip, IconButton} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import Suggestion from "./suggestion";


interface SPProps {
    open: boolean
    suggestions: Suggestion[]
    onAccept: (text: string) => any
    onClose: () => any
}


export default function SuggestionsPanel(props: SPProps) {
    const [size, setSize] = useState<number>(5);

    const handleClose = () => {
        setSize(5);
        props.onClose();
    }

    return (
        <Collapse
            orientation='horizontal'
            in={props.open}
            onExit={() => handleClose()}
            timeout='auto'
            sx={{
                position: 'absolute',
                top: 0,
                height: '100%',
                maxWidth: "100%",
                display: 'block'
            }}
        >
            <div id="suggestions-panel">
                <Stack direction='row'>
                    <Typography variant='h5' id="suggestions-panel-heading">
                        Suggestions
                    </Typography>
                    <Tooltip title="Close">
                        <IconButton
                            onClick={handleClose}
                            sx={{position: 'absolute', right: '10px'}}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>

                <div id="suggestions-list">
                    <Divider/>
                    {props.suggestions.slice(0, size).map((suggestion, key) => (
                        <ButtonBase key={key} onClick={() => props.onAccept(suggestion.text)} sx={{width: 1}}>
                            <div className="suggestion">
                                <div className="suggestion-body">
                                    <Stack direction='row'>
                                        <div className="suggestion-thumbnail-container">
                                            <img className="suggestion-thumbnail" src={suggestion.thumbnail} alt=""/>
                                        </div>
                                        <div className="suggestion-title-container">
                                            <Typography variant='body1' sx={{textAlign: 'left', marginRight: '10px'}}>
                                                {suggestion.text}
                                            </Typography>
                                        </div>
                                        <KeyboardDoubleArrowRightIcon fontSize='small'/>
                                    </Stack>
                                </div>
                                <Divider/>
                            </div>
                        </ButtonBase>
                    ))}
                    <Button
                        onClick={() => setSize(size + 5)}
                        disabled={size >= props.suggestions.length}
                    >
                        See More
                    </Button>
                </div>
            </div>
        </Collapse>
    );
}