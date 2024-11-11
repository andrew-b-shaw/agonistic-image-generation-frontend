'use client'

import React, {useState} from "react";
import Interpretation from "./interpretation";
import TextEntryField from "../text-entry-field";

import {Typography, Accordion, AccordionSummary, AccordionDetails, Button, Link, IconButton, Divider, Stack, Tooltip} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import InterpretationItem from "@/app/agonistic/intepretation-item";

interface IPProps {
    phrase: string
    interpretations: Interpretation[]
    onAccept: (suggestion: string) => any
    onClose: () => any
}

export default function InterpretationsPanel(props: IPProps) {
    const [expanded, setExpanded] = useState<number | false>(false);
    const [size, setSize] = useState<number>(5);


    const handleChange = (key: number) => (
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? key : false);
        }
    );

    const handleClose = () => {
        setSize(5);
        setExpanded(false);
        props.onClose();
    }

    return (
        <div id="suggestions-panel">
            <Stack direction='row'>
                <Typography variant='h5' id="suggestions-panel-heading">
                    {"Interpretations for '" + props.phrase + "'"}
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

            <div id="suggestions-accordion">
                <Divider/>
                {props.interpretations.slice(0, size).map((interpretation, key) => (
                    <InterpretationItem
                        key={key}
                        expanded={expanded === key}
                        interpretation={interpretation}
                        onChange={handleChange(key)}
                        onAccept={props.onAccept}
                    />
                ))}
                <Button
                    onClick={() => setSize(size + 5)}
                    disabled={size >= props.interpretations.length}
                >
                    See More
                </Button>
            </div>

            <TextEntryField
                placeholder="Write your own interpretation or leave it ambiguous!"
                onAccept={props.onAccept}
                tooltip="Accept"
                sx={{width: 'calc(100% - 34px)', position: 'absolute', bottom: '10px'}}
            />
        </div>
    );
}