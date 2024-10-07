'use client'

import React from "react";
import Note from './note';
import NoteCard from "./notecard";
import InfoTooltip from "../info-tooltip";

import {Typography, Stack} from "@mui/material";


interface NotesProps {
    notes: Note[]
    onClick: (phrase: string) => any
    onEdit: (phrase: string, annotation: string) => any
    loading: string | false
}

export default function NotesPanel(props: NotesProps) {
    return (
        <div id="notes-panel">
            <Stack direction='row' sx={{mb: '20px'}}>
                <Typography variant='h4'>
                    Detected Subjects
                </Typography>
                <InfoTooltip
                    sx={{position: 'absolute', right: '30px'}}
                    info="Some of the subjects from your prompt may contain ambiguity or unconscious bias. Enter a prompt in the prompt entry box above and explore possible interpretations with the help of AI below. You can choose to keep your prompt as is or edit the suggestions after exploring. "
                />
            </Stack>
            {Object.keys(props.notes).length > 0 &&
                <div>
                    {Object.values(props.notes).map((note, key) => (
                        <NoteCard
                            key={key}
                            note={note}
                            onClick={props.onClick}
                            onEdit={props.onEdit}
                        />
                    ))}
                </div>
            }
        </div>
    );
}