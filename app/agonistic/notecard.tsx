import React from "react";
import Note from "./note";
import {Paper, Typography, Divider, Stack, IconButton, Link, TextField, Tooltip} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface NotecardProps {
    note: Note
    onClick: (phrase: string) => any
    onEdit: (phrase: string, annotation: string) => any
}

export default function Notecard(props: NotecardProps) {
    return (
        <Paper elevation={2} square className="notecard">
            <div className="notecard-header">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant='h6'>
                        {props.note.phrase}
                    </Typography>
                    {props.note.annotation &&
                        <Tooltip title="See Possible Interpretations">
                            <IconButton onClick={() => props.onClick(props.note.phrase)}>
                                <KeyboardDoubleArrowRightIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                </Stack>
            </div>
            <Divider />
            <div className="notecard-body">
                {props.note.annotation ?
                    <TextField
                        multiline
                        onChange={(event: any) => props.onEdit(props.note.phrase, event.target.value)}
                        value={props.note.annotation}
                        sx={{width: 1}}
                    /> :
                    <Typography variant='button'>
                        <Link onClick={() => props.onClick(props.note.phrase)}>
                            See Possible Interpretations
                            <KeyboardDoubleArrowRightIcon sx={{fontSize: 15, transform: "translate(2px, 2px)"}}/>
                        </Link>
                    </Typography>
                }
            </div>
        </Paper>
    )
}