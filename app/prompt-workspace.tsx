'use client'

import React from "react";

import {Typography, Stack, IconButton, TextField, Link, Paper, Tooltip} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";


interface WorkspaceProps {
    prompt: string
    value: string
    onOpenPanel: () => any
    onEdit: (annotation: string) => any
    loading: boolean
}

export default function PromptWorkspace(props: WorkspaceProps) {
    return (
        <div className="prompt-workspace">
            <Stack direction='row' sx={{mb: '20px'}}>
                <Typography variant='h4'>
                    Prompt Workspace
                </Typography>
                {props.value != "" &&
                    <Tooltip title="See possible interpretations">
                        <IconButton
                            onClick={() => props.onOpenPanel()}
                            sx={{position: 'absolute', right: '30px'}}
                        >
                            <KeyboardDoubleArrowRightIcon/>
                        </IconButton>
                    </Tooltip>
                }
            </Stack>

            <Paper className="prompt-workspace-body">
                {!props.loading &&
                    (props.prompt != "" ?
                        (props.value != "" ?
                            <TextField
                                multiline
                                onChange={(event: any) => props.onEdit(event.target.value)}
                                value={props.value}
                                sx={{width: 1}}
                            /> :
                            <Typography
                                variant='button'
                                className="center-content"
                            >
                                <Link onClick={() => props.onOpenPanel()}>
                                    See Possible Interpretations
                                    <KeyboardDoubleArrowRightIcon sx={{fontSize: 15, transform: "translate(2px, 2px)"}}/>
                                </Link>
                            </Typography>
                        ) :
                        <Typography
                            variant='subtitle1'
                            className="center-content"
                            sx={{textAlign: 'center'}}
                        >
                            Enter prompt to begin the image generation process!
                        </Typography>
                    )
                }
            </Paper>
        </div>
    );
}