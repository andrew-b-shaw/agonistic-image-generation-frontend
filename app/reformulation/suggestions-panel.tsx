'use client'

import React, {useState} from "react";
import InfoTooltip from "@/app/info-tooltip";
import {Button, Stack, Paper, Divider, ButtonBase, Typography} from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import Suggestion from "@/app/reformulation/Suggestion";


interface SPProps {
    suggestions: Suggestion[]
    onAccept: (text: string) => any
}


export default function SuggestionsPanel(props: SPProps) {
    const [expanded, setExpanded] = useState(false);
    const [size, setSize] = useState(5);

    return (
        <div id="suggestions-panel">
            <Stack direction='row' sx={{mb: '20px'}}>
                <Typography variant='h4'>
                    Suggestions
                </Typography>
                <InfoTooltip
                    sx={{position: 'absolute', right: '30px'}}
                    info="Your prompt may contain ambiguity or unconscious bias. Reformulate your prompt with the help of AI below. You can choose to keep your prompt as is or edit the suggestions in the text box above after clicking them."
                />
            </Stack>
            {props.suggestions.length > 0 &&
                <div id="suggestions-list">
                    <Paper>
                        <Stack>
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
                                                <NorthEastIcon fontSize='small'/>
                                            </Stack>
                                        </div>
                                        <Divider/>
                                    </div>
                                </ButtonBase>
                            ))}
                        </Stack>
                    </Paper>
                    <Button
                        onClick={() => setSize(size + 5)}
                        disabled={size >= props.suggestions.length}
                    >
                        See More
                    </Button>
                </div>
            }
        </div>
    );
}